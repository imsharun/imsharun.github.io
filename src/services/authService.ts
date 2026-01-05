import {
  fetchAuthSession,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  fetchUserAttributes,
  updatePassword,
} from 'aws-amplify/auth';

const apiBase = ((import.meta as any).env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function withBase(path: string) {
  return apiBase ? `${apiBase}${path}` : path;
}

export async function signup(email: string, password: string, fullName: string, phoneNumber: string, address: string) {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name: fullName,
        phone_number: phoneNumber,
        address,
      },
    },
  });
}

export async function getIdToken(): Promise<string> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken;
  if (!token) throw new Error('No ID token in session');
  return token.toString();
}

export async function tryGetIdToken(): Promise<string | null> {
  try {
    return await getIdToken();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  return signIn({
    username: email,
    password,
    options: { authFlowType: 'USER_PASSWORD_AUTH' },
  });
}

export async function logout() {
  return signOut();
}

export async function confirmEmail(email: string, code: string) {
  return confirmSignUp({ username: email, confirmationCode: code });
}

export async function resendEmailCode(email: string) {
  return resendSignUpCode({ username: email });
}

export async function startPasswordReset(email: string) {
  return resetPassword({ username: email });
}

export async function confirmPasswordReset(email: string, code: string, newPassword: string) {
  return confirmResetPassword({ username: email, confirmationCode: code, newPassword });
}

export async function getCurrentUserInfo() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
}

export type UserProfile = {
  username: string;
  email: string | null;
  name?: string;
  phoneNumber?: string;
  address?: string;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser();
    const attrs = await fetchUserAttributes();
    return {
      username: user.username,
      email: attrs.email ?? user.signInDetails?.loginId ?? null,
      name: attrs.name,
      phoneNumber: attrs.phone_number,
      address: attrs.address,
    };
  } catch {
    return null;
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return updatePassword({ oldPassword: currentPassword, newPassword });
}

export async function getCart() {
  const token = await getIdToken();
  const res = await fetch(withBase('/api/cart'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`getCart failed: ${res.status}`);
  return res.json();
}

export async function checkout(customerName: string) {
  const token = await getIdToken();
  const res = await fetch(withBase('/api/checkout'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerName }),
  });
  if (!res.ok) throw new Error(`checkout failed: ${res.status}`);
  return res.json();
}

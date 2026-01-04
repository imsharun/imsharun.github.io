import {
  fetchAuthSession,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
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

export async function getCurrentUserInfo() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
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

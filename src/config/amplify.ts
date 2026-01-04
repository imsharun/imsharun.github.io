import { Amplify } from 'aws-amplify';

const userPoolId = (import.meta as any).env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = (import.meta as any).env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID;

// Amplify v6 auth config: region is inferred from the userPoolId; keep config minimal
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
    },
  },
});

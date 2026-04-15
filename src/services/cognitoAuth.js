import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

export const isCognitoConfigured = !!(POOL_ID && CLIENT_ID);

const userPool = isCognitoConfigured
  ? new CognitoUserPool({ UserPoolId: POOL_ID, ClientId: CLIENT_ID })
  : null;

export function signUp(email, password) {
  if (!userPool) return Promise.reject(new Error('Cognito is not configured'));

  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    userPool.signUp(email, password, attributes, null, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function confirmSignUp(email, code) {
  if (!userPool) return Promise.reject(new Error('Cognito is not configured'));

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function signIn(email, password) {
  if (!userPool) return Promise.reject(new Error('Cognito is not configured'));

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut() {
  if (!userPool) return;

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

export function getCurrentSession() {
  if (!userPool) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) return resolve(null);

    cognitoUser.getSession((err, session) => {
      if (err) return reject(err);
      if (!session.isValid()) return resolve(null);
      resolve(session);
    });
  });
}

export function getCurrentUser() {
  if (!userPool) return null;

  return userPool.getCurrentUser();
}

export function getAccessToken() {
  if (!userPool) return Promise.resolve(null);

  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) return resolve(null);

    cognitoUser.getSession((err, session) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve(session.getAccessToken().getJwtToken());
    });
  });
}

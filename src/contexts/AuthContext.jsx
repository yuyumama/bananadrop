import { useState, useEffect } from 'react';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentSession,
} from '../services/cognitoAuth';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentSession()
      .then((session) => {
        if (session) {
          setUser({
            email: session.getIdToken().payload.email,
            sub: session.getIdToken().payload.sub,
          });
        }
      })
      .catch(() => {
        // No valid session
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSignUp = async (email, password) => {
    await signUp(email, password);
  };

  const handleConfirmSignUp = async (email, code) => {
    await confirmSignUp(email, code);
  };

  const handleSignIn = async (email, password) => {
    const session = await signIn(email, password);
    setUser({
      email: session.getIdToken().payload.email,
      sub: session.getIdToken().payload.sub,
    });
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

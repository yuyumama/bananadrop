import { useAuth } from '../../hooks/useAuth';
import AuthScreen from './AuthScreen';
import LoadingScreen from '../ui/LoadingScreen';

export default function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return children;
}

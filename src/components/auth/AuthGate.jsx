import { useAuth } from '../../hooks/useAuth';
import AuthScreen from './AuthScreen';

export default function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loaderWrap}>
          <img
            src={`${import.meta.env.BASE_URL}banana_gold_01.png`}
            alt=""
            style={styles.loaderBanana}
          />
          <div style={styles.loaderDot} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return children;
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background:
      'radial-gradient(ellipse at 50% 20%, #fff9e6 0%, #fcfaf5 50%, #f5efe0 100%)',
  },
  loaderWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  loaderBanana: {
    width: '48px',
    height: 'auto',
    animation: 'bananaFloat 1.5s ease-in-out infinite',
    filter: 'drop-shadow(0 6px 12px rgba(212, 175, 55, 0.3))',
  },
  loaderDot: {
    width: '24px',
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(212, 175, 55, 0.2)',
    animation: 'loaderPulse 1.5s ease-in-out infinite',
  },
};

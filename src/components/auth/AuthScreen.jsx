import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ConfirmForm from './ConfirmForm';

const BANANA_IMAGES = [
  'banana_ripe_01.png',
  'banana_ripe_02.png',
  'banana_gold_01.png',
  'banana_gold_02.png',
  'banana_green_01.png',
  'banana_green_02.png',
  'banana_red_01.png',
  'banana_copper_01.png',
];

function FallingBanana({ delay, left, duration, size, rotation, image }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}${image}`}
      alt=""
      style={{
        position: 'absolute',
        top: '-60px',
        left: `${left}%`,
        width: `${size}px`,
        height: 'auto',
        opacity: 0.35,
        pointerEvents: 'none',
        animation: `banana-fall ${duration}s linear ${delay}s infinite`,
        transform: `rotate(${rotation}deg)`,
        filter: 'blur(1px)',
      }}
    />
  );
}

function FallingBananas() {
  const [bananas] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 6,
      size: 24 + Math.random() * 28,
      rotation: Math.random() * 360,
      image: BANANA_IMAGES[Math.floor(Math.random() * BANANA_IMAGES.length)],
    })),
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {bananas.map((b) => (
        <FallingBanana key={b.id} {...b} />
      ))}
    </div>
  );
}

export default function AuthScreen() {
  const { signIn, signUp, confirmSignUp } = useAuth();
  const [view, setView] = useState('login');
  const [error, setError] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [slideDir, setSlideDir] = useState('none');
  const cardRef = useRef(null);
  const transitionTimers = useRef([]);

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach(clearTimeout);
    };
  }, []);

  const animateTransition = useCallback((newView, dir) => {
    transitionTimers.current.forEach(clearTimeout);
    transitionTimers.current = [];
    setSlideDir(dir);
    setError('');
    const t1 = setTimeout(() => {
      setView(newView);
      setSlideDir(dir === 'left' ? 'enter-right' : 'enter-left');
      const t2 = setTimeout(() => setSlideDir('none'), 300);
      transitionTimers.current.push(t2);
    }, 200);
    transitionTimers.current.push(t1);
  }, []);

  const handleSignIn = async (email, password) => {
    setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'ログインに失敗しました');
    }
  };

  const handleSignUp = async (email, password) => {
    setError('');
    try {
      await signUp(email, password);
      setConfirmEmail(email);
      animateTransition('confirm', 'left');
    } catch (err) {
      setError(err.message || 'アカウント作成に失敗しました');
    }
  };

  const handleConfirm = async (email, code) => {
    setError('');
    try {
      await confirmSignUp(email, code);
      animateTransition('login', 'right');
    } catch (err) {
      setError(err.message || '認証コードが正しくありません');
    }
  };

  // Bounce the hero banana on mount
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.backdrop}>
      <FallingBananas />

      <div style={styles.container}>
        {/* Hero banana */}
        <div
          style={{
            ...styles.heroBanana,
            transform: heroLoaded
              ? 'translateY(0) scale(1) rotate(-8deg)'
              : 'translateY(-30px) scale(0.5) rotate(-30deg)',
            opacity: heroLoaded ? 1 : 0,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}banana_gold_01.png`}
            alt="BananaDrop"
            style={styles.heroImg}
          />
        </div>

        {/* Title */}
        <div
          style={{
            ...styles.titleWrap,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(10px)',
            opacity: heroLoaded ? 1 : 0,
          }}
        >
          <h1 style={styles.title}>BananaDrop</h1>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          style={{
            ...styles.card,
            ...(slideDir === 'left' && styles.slideOutLeft),
            ...(slideDir === 'right' && styles.slideOutRight),
            ...(slideDir === 'enter-right' && styles.slideInRight),
            ...(slideDir === 'enter-left' && styles.slideInLeft),
          }}
        >
          {view === 'login' && (
            <LoginForm
              onSubmit={handleSignIn}
              onSwitchToSignup={() => animateTransition('signup', 'left')}
              error={error}
            />
          )}

          {view === 'signup' && (
            <SignupForm
              onSubmit={handleSignUp}
              onSwitchToLogin={() => animateTransition('login', 'right')}
              error={error}
            />
          )}

          {view === 'confirm' && (
            <ConfirmForm
              email={confirmEmail}
              onSubmit={handleConfirm}
              onBack={() => animateTransition('login', 'right')}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background:
      'radial-gradient(ellipse at 50% 20%, #fff9e6 0%, #fcfaf5 50%, #f5efe0 100%)',
    padding: '20px',
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
    width: '100%',
    maxWidth: '380px',
  },
  heroBanana: {
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    marginBottom: '-8px',
    zIndex: 2,
    filter: 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.35))',
  },
  heroImg: {
    width: '72px',
    height: 'auto',
    animation: 'banana-float 3s ease-in-out infinite',
  },
  titleWrap: {
    textAlign: 'center',
    marginBottom: '20px',
    transition: 'all 0.5s ease 0.15s',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 900,
    letterSpacing: '-1px',
    background:
      'linear-gradient(135deg, #d4af37 0%, #f0d060 40%, #b8860b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.2))',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#a09070',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  card: {
    width: '100%',
    padding: '28px 24px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow:
      '0 12px 40px rgba(132, 122, 100, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.08)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },
  slideOutLeft: {
    transform: 'translateX(-20px)',
    opacity: 0,
  },
  slideOutRight: {
    transform: 'translateX(20px)',
    opacity: 0,
  },
  slideInRight: {
    animation: 'auth-slide-in-right 0.3s ease forwards',
  },
  slideInLeft: {
    animation: 'auth-slide-in-left 0.3s ease forwards',
  },
};

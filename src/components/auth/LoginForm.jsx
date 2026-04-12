import { useState } from 'react';

export default function LoginForm({ onSubmit, onSwitchToSignup, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>メールアドレス</label>
        <div
          style={{
            ...styles.inputWrap,
            ...(focusedField === 'email' ? styles.inputWrapFocused : {}),
          }}
        >
          <span style={styles.inputIcon}>✉</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            style={styles.input}
            placeholder="banana@example.com"
          />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>パスワード</label>
        <div
          style={{
            ...styles.inputWrap,
            ...(focusedField === 'password' ? styles.inputWrapFocused : {}),
          }}
        >
          <span style={styles.inputIcon}>🔒</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
            style={styles.input}
            placeholder="••••••••"
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} style={styles.button}>
        <span style={styles.buttonText}>
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </span>
        {!isSubmitting && <span style={styles.buttonIcon}>→</span>}
      </button>

      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        <span style={styles.dividerText}>or</span>
        <span style={styles.dividerLine} />
      </div>

      <p style={styles.switchText}>
        はじめての方は{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          style={styles.linkButton}
        >
          アカウント作成
        </button>
      </p>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#8a7a60',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingLeft: '2px',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 14px',
    borderRadius: '12px',
    border: '1.5px solid rgba(212, 175, 55, 0.15)',
    background: 'rgba(255, 253, 240, 0.6)',
    transition: 'all 0.25s ease',
  },
  inputWrapFocused: {
    borderColor: 'rgba(212, 175, 55, 0.5)',
    background: 'rgba(255, 253, 240, 0.9)',
    boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
  },
  inputIcon: {
    fontSize: '14px',
    opacity: 0.5,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    color: '#4a4a4a',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background:
      'linear-gradient(135deg, #d4af37 0%, #e8c84a 50%, #b8860b 100%)',
    backgroundSize: '200% 200%',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonText: {
    position: 'relative',
    zIndex: 1,
  },
  buttonIcon: {
    fontSize: '18px',
    position: 'relative',
    zIndex: 1,
    transition: 'transform 0.2s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
  },
  dividerText: {
    fontSize: '11px',
    color: '#bba880',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  switchText: {
    margin: 0,
    textAlign: 'center',
    fontSize: '13px',
    color: '#8a7a60',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#b8860b',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    fontSize: '13px',
    fontFamily: "'Outfit', sans-serif",
    textDecoration: 'none',
    borderBottom: '1.5px solid rgba(184, 134, 11, 0.3)',
    transition: 'border-color 0.2s',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(220, 38, 38, 0.06)',
    border: '1px solid rgba(220, 38, 38, 0.12)',
    color: '#b91c1c',
    fontSize: '13px',
    lineHeight: 1.4,
  },
  errorIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#dc2626',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 800,
    flexShrink: 0,
  },
};

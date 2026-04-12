import { useState } from 'react';

export default function SignupForm({ onSubmit, onSwitchToLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('パスワードが一致しません');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
          ? 3
          : 2;

  const strengthColors = ['transparent', '#e57373', '#ffb74d', '#81c784'];
  const strengthLabels = ['', '弱い', '普通', '強い'];

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {displayError && (
        <div role="alert" style={styles.error}>
          <span style={styles.errorIcon}>!</span>
          {displayError}
        </div>
      )}

      <div style={styles.fieldGroup}>
        <label htmlFor="signup-email" style={styles.label}>
          メールアドレス
        </label>
        <div
          style={{
            ...styles.inputWrap,
            ...(focusedField === 'email' ? styles.inputWrapFocused : {}),
          }}
        >
          <span style={styles.inputIcon}>✉</span>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            autoComplete="email"
            style={styles.input}
            placeholder="banana@example.com"
          />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="signup-password" style={styles.label}>
          パスワード
        </label>
        <div
          style={{
            ...styles.inputWrap,
            ...(focusedField === 'password' ? styles.inputWrapFocused : {}),
          }}
        >
          <span style={styles.inputIcon}>🔒</span>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (localError) setLocalError('');
            }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
            minLength={8}
            autoComplete="new-password"
            style={styles.input}
            placeholder="8文字以上"
          />
        </div>
        {password.length > 0 && (
          <div style={styles.strengthRow}>
            <div style={styles.strengthBar}>
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  style={{
                    ...styles.strengthSegment,
                    background:
                      passwordStrength >= level
                        ? strengthColors[passwordStrength]
                        : 'rgba(0,0,0,0.06)',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                ...styles.strengthLabel,
                color: strengthColors[passwordStrength],
              }}
            >
              {strengthLabels[passwordStrength]}
            </span>
          </div>
        )}
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="signup-confirm-password" style={styles.label}>
          パスワード（確認）
        </label>
        <div
          style={{
            ...styles.inputWrap,
            ...(focusedField === 'confirm' ? styles.inputWrapFocused : {}),
          }}
        >
          <span style={styles.inputIcon}>🔒</span>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (localError) setLocalError('');
            }}
            onFocus={() => setFocusedField('confirm')}
            onBlur={() => setFocusedField(null)}
            required
            style={styles.input}
            placeholder="もう一度入力"
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} style={styles.button}>
        {isSubmitting ? 'アカウント作成中...' : 'アカウントを作成'}
      </button>

      <p style={styles.switchText}>
        すでにアカウントをお持ちの方は{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={styles.linkButton}
        >
          ログイン
        </button>
      </p>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
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
  strengthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '2px',
  },
  strengthBar: {
    display: 'flex',
    gap: '3px',
    flex: 1,
  },
  strengthSegment: {
    height: '3px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background 0.3s ease',
  },
  strengthLabel: {
    fontSize: '11px',
    fontWeight: 700,
    minWidth: '28px',
    textAlign: 'right',
    transition: 'color 0.3s ease',
  },
  button: {
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background:
      'linear-gradient(135deg, #d4af37 0%, #e8c84a 50%, #b8860b 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
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

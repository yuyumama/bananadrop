import { useState, useRef, useEffect } from 'react';

export default function ConfirmForm({ email, onSubmit, onBack, error }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index, value) => {
    // Handle paste of full code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((d, i) => {
        if (index + i < 6) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email, code);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.iconWrap}>
        <span style={styles.mailIcon}>📧</span>
      </div>

      <div style={styles.textCenter}>
        <h3 style={styles.heading}>メール認証</h3>
        <p style={styles.description}>
          <strong style={{ color: '#4a4a4a' }}>{email}</strong> に
          <br />
          認証コードを送信しました
        </p>
      </div>

      {error && (
        <div id="confirm-code-error" role="alert" style={styles.error}>
          <span style={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      <div role="group" aria-label="認証コード（6桁）" style={styles.codeRow}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`認証コード ${i + 1} 桁目`}
            aria-invalid={!!error}
            aria-describedby={error ? 'confirm-code-error' : undefined}
            style={{
              ...styles.codeInput,
              borderColor: digit
                ? 'rgba(212, 175, 55, 0.5)'
                : 'rgba(212, 175, 55, 0.15)',
              background: digit
                ? 'rgba(255, 253, 240, 0.9)'
                : 'rgba(255, 253, 240, 0.5)',
            }}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isComplete}
        style={{
          ...styles.button,
          opacity: isComplete ? 1 : 0.5,
        }}
      >
        {isSubmitting ? '確認中...' : '認証する'}
      </button>

      <button type="button" onClick={onBack} style={styles.backButton}>
        ← ログインに戻る
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    alignItems: 'center',
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background:
      'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(212, 175, 55, 0.15)',
  },
  mailIcon: {
    fontSize: '28px',
  },
  textCenter: {
    textAlign: 'center',
  },
  heading: {
    margin: '0 0 4px',
    fontSize: '20px',
    fontWeight: 800,
    color: '#4a4a4a',
  },
  description: {
    margin: 0,
    fontSize: '13px',
    color: '#8a7a60',
    lineHeight: 1.6,
  },
  codeRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    width: '100%',
    margin: '4px 0',
  },
  codeInput: {
    width: '44px',
    height: '52px',
    borderRadius: '12px',
    border: '1.5px solid rgba(212, 175, 55, 0.15)',
    background: 'rgba(255, 253, 240, 0.5)',
    fontSize: '22px',
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: '#4a4a4a',
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.2s ease',
    caretColor: '#d4af37',
  },
  button: {
    width: '100%',
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
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#8a7a60',
    fontSize: '13px',
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'color 0.2s',
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
    width: '100%',
    boxSizing: 'border-box',
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

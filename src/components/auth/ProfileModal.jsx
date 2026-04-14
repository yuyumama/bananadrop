import { useState } from 'react';
import { putProfile } from '../../services/saveApi';

const MAX_LENGTH = 20;

export default function ProfileModal({ userName, onClose, onSaved }) {
  const [value, setValue] = useState(userName ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('ユーザー名を入力してください');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`${MAX_LENGTH}文字以内で入力してください`);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await putProfile(trimmed);
      onSaved(result.userName);
      onClose();
    } catch (err) {
      setError(err.message ?? '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="プロフィール設定"
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div style={styles.header}>
          <span style={styles.title}>プロフィール</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>!</span>
              {error}
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label htmlFor="profile-username" style={styles.label}>
              ユーザー名
            </label>
            <div
              style={{
                ...styles.inputWrap,
                ...(focused ? styles.inputWrapFocused : {}),
              }}
            >
              <span style={styles.inputIcon}>🍌</span>
              <input
                id="profile-username"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={MAX_LENGTH}
                placeholder="表示名を入力（日本語可）"
                style={styles.input}
                autoComplete="off"
              />
              <span style={styles.counter}>
                {value.length}/{MAX_LENGTH}
              </span>
            </div>
            <p style={styles.hint}>リーダーボードに表示される名前です</p>
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
            <span style={styles.buttonText}>
              {isSubmitting ? '保存中...' : '保存する'}
            </span>
            {!isSubmitting && <span style={styles.buttonIcon}>→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  panel: {
    width: 'min(380px, 92vw)',
    borderRadius: '28px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid var(--accent-gold-soft)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    animation: 'slideInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#3a3020',
    letterSpacing: '0.02em',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#8a7a60',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'background 0.15s',
    fontFamily: 'inherit',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  counter: {
    fontSize: '11px',
    color: '#bba880',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  hint: {
    margin: 0,
    fontSize: '11px',
    color: '#bba880',
    paddingLeft: '2px',
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
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
  },
  buttonText: {
    position: 'relative',
    zIndex: 1,
  },
  buttonIcon: {
    fontSize: '18px',
    position: 'relative',
    zIndex: 1,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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

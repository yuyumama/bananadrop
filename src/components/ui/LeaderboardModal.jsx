import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/saveApi';

export default function LeaderboardModal({ currentUserName, onClose }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeaderboard()
      .then((data) => setEntries(data.entries ?? []))
      .catch((err) => setError(err.message ?? '取得に失敗しました'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="リーダーボード"
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <span style={styles.title}>🏆 リーダーボード</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {isLoading && <p style={styles.message}>読み込み中...</p>}
          {error && <p style={styles.errorMessage}>{error}</p>}
          {!isLoading && !error && entries.length === 0 && (
            <p style={styles.message}>まだスコアが登録されていません</p>
          )}
          {!isLoading && !error && entries.length > 0 && (
            <ol style={styles.list}>
              {entries.map((entry) => {
                const isMe = entry.userName === currentUserName;
                return (
                  <li key={entry.rank} style={styles.entry(entry.rank, isMe)}>
                    <span style={styles.rank(entry.rank)}>
                      {entry.rank === 1
                        ? '🥇'
                        : entry.rank === 2
                          ? '🥈'
                          : entry.rank === 3
                            ? '🥉'
                            : entry.rank}
                    </span>
                    <span style={styles.userName}>
                      {entry.userName}
                      {isMe && <span style={styles.meBadge}>YOU</span>}
                    </span>
                    <span style={styles.score}>
                      {entry.score.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
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
    width: 'min(420px, 92vw)',
    maxHeight: '80vh',
    borderRadius: '28px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid var(--accent-gold-soft)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    animation: 'slideInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
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
  body: {
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
  },
  message: {
    textAlign: 'center',
    color: '#8a7a60',
    fontSize: '14px',
    padding: '24px 0',
    margin: 0,
  },
  errorMessage: {
    textAlign: 'center',
    color: '#b91c1c',
    fontSize: '13px',
    padding: '24px 0',
    margin: 0,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  entry: (rank, isMe) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: '12px',
    background: isMe
      ? 'rgba(212,175,55,0.12)'
      : rank <= 3
        ? 'rgba(212,175,55,0.06)'
        : 'rgba(0,0,0,0.02)',
    border: isMe
      ? '1.5px solid rgba(212,175,55,0.35)'
      : '1.5px solid transparent',
    fontWeight: isMe ? 700 : 500,
  }),
  rank: (rank) => ({
    minWidth: 28,
    textAlign: 'center',
    fontSize: rank <= 3 ? '1.2rem' : '0.85rem',
    fontWeight: 700,
    color: '#8a7a60',
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  }),
  userName: {
    flex: 1,
    fontSize: '14px',
    color: '#3a3020',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  meBadge: {
    fontSize: '9px',
    fontWeight: 800,
    color: '#b8860b',
    background: 'rgba(212,175,55,0.2)',
    border: '1px solid rgba(212,175,55,0.4)',
    borderRadius: '4px',
    padding: '1px 5px',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  score: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#5a4a30',
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
};

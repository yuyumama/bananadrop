function ScoreDisplay({ score, perSecond, scoreBump, devMode }) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        zIndex: 10,
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        animation: scoreBump ? 'scoreBump 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)' : 'none',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.2rem', color: '#d4af37' }}>🍌</span>
        <span
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
          }}
        >
          {score.toLocaleString()}
        </span>
        {devMode && (
          <span
            style={{
              fontSize: '0.6rem',
              background: 'var(--accent-gold)',
              color: '#fff',
              borderRadius: 4,
              padding: '2px 6px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            STUDIO
          </span>
        )}
      </div>
      {perSecond > 0 && (
        <div
          style={{
            paddingLeft: 22,
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ opacity: 0.6 }}>獲得</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
            +{perSecond.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.65rem' }}>/秒</span>
        </div>
      )}
    </div>
  );
}

export default ScoreDisplay;

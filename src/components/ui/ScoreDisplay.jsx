function ScoreDisplay({ score, perSecond, scoreBump }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 10,
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 16,
        padding: '10px 20px',
        fontWeight: 'bold',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        animation: scoreBump ? 'scoreBump 0.3s ease-out' : 'none',
      }}
    >
      <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>
        🍌 {score.toLocaleString()}
      </span>
      {perSecond > 0 && (
        <span style={{ fontSize: '0.72rem', color: '#888' }}>
          +{perSecond.toLocaleString()}/秒
        </span>
      )}
    </div>
  );
}

export default ScoreDisplay;

function UpgradeGroupCard({
  group,
  currentLabel,
  nextItem,
  affordable,
  onBuy,
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '0.6rem',
          fontWeight: 800,
          color: 'var(--text-muted)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {group.label}
      </div>
      {!nextItem ? (
        <button
          disabled
          className="premium-button"
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--bg-accent)',
            borderColor: 'var(--accent-gold-soft)',
            cursor: 'default',
            opacity: 0.8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
            {currentLabel}
          </div>
          <div
            style={{
              fontSize: '0.55rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            MAXED
          </div>
        </button>
      ) : (
        <button
          className="premium-button"
          onClick={(event) => {
            event.stopPropagation();
            onBuy(nextItem);
          }}
          disabled={!affordable}
          style={{
            width: '100%',
            height: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: '2px',
          }}
        >
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {currentLabel}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 800 }}>
            → {nextItem.label}
          </div>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: affordable ? 'var(--accent-gold)' : 'var(--text-muted)',
            }}
          >
            🍌 {nextItem.cost.toLocaleString()}
          </div>
        </button>
      )}
    </div>
  );
}

export default UpgradeGroupCard;

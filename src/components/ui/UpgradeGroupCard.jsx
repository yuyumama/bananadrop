function UpgradeGroupCard({
  group,
  currentLabel,
  nextItem,
  affordable,
  onBuy,
  score,
}) {
  const progress = nextItem ? Math.min(100, (score / nextItem.cost) * 100) : 0;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
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
          letterSpacing: '0.08em',
        }}
      >
        {group.label}
      </div>

      <button
        className="premium-button"
        onClick={nextItem ? (e) => { e.stopPropagation(); onBuy(nextItem); } : undefined}
        disabled={nextItem ? !affordable : true}
        style={{
          width: '100%',
          height: '56px', // Slightly taller for more elegance
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: '8px 4px 10px 4px', // Balanced top padding to push text down
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: !nextItem ? 'var(--bg-accent)' : affordable ? '#fffef0' : 'white',
          borderColor: affordable ? 'var(--accent-gold)' : 'var(--glass-border)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: nextItem ? (affordable ? 'pointer' : 'not-allowed') : 'default',
        }}
      >
        {!nextItem ? (
          <>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
              {currentLabel}
            </div>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>
              MAXED COLLECTION
            </div>
          </>
        ) : (
          <>
            {/* Boutique Label: Current Level */}
            <div style={{
              fontSize: '0.5rem',
              color: 'var(--text-muted)',
              fontWeight: 300, // Minimalist weight
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {currentLabel}
            </div>

            {/* Price Tag Separator */}
            <div style={{
              width: '12px',
              height: '1px',
              backgroundColor: 'rgba(0,0,0,0.05)',
              margin: '2px 0'
            }} />

            {/* Action: Next Level */}
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              fontWeight: 800, // Focus on the next goal
              letterSpacing: '-0.01em'
            }}>
              {nextItem.label}
            </div>

            {/* Cost Component */}
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: affordable ? 'var(--accent-gold)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              marginTop: 1
            }}>
              <span style={{ fontSize: '0.8em', opacity: 0.8 }}>🍌</span>
              <span>{nextItem.cost.toLocaleString()}</span>
            </div>

            {/* Progress Meter: Luxury variant */}
            {!affordable && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '5px',
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, #f4e4bc, #e6b800)',
                    transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 0 10px rgba(230, 184, 0, 0.2)',
                  }}
                />
              </div>
            )}
          </>
        )}
      </button>
    </div>
  );
}

export default UpgradeGroupCard;

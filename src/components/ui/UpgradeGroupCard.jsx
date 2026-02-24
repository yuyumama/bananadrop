function UpgradeGroupCard({
  group,
  currentLabel,
  nextItem,
  affordable,
  onBuy,
  score,
}) {
  const progress = nextItem
    ? Math.min(100, (score / nextItem.cost) * 100)
    : 100;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        minWidth: 0,
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          textAlign: 'center',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {group.label}
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '10px',
          border: `1.5px solid ${
            !nextItem
              ? 'rgba(76,175,80,0.35)'
              : affordable
                ? 'var(--accent-gold)'
                : 'rgba(0,0,0,0.08)'
          }`,
          background: !nextItem
            ? 'linear-gradient(160deg, #f9fff4, #f0fae8)'
            : affordable
              ? 'linear-gradient(160deg, #fffef5, #fffbe8)'
              : '#fafafa',
          boxShadow: affordable
            ? '0 2px 12px rgba(212,175,55,0.18)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          cursor: nextItem ? (affordable ? 'pointer' : 'default') : 'default',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'none',
          minHeight: '64px',
        }}
        onClick={
          nextItem && affordable
            ? (e) => {
                e.stopPropagation();
                onBuy(nextItem);
              }
            : undefined
        }
        onMouseEnter={(e) => {
          if (!affordable || !nextItem) return;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,175,55,0.28)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = affordable
            ? '0 2px 12px rgba(212,175,55,0.18)'
            : '0 1px 4px rgba(0,0,0,0.06)';
        }}
        onMouseDown={(e) => {
          if (!affordable || !nextItem) return;
          e.currentTarget.style.transform = 'translateY(0) scale(0.97)';
        }}
        onMouseUp={(e) => {
          if (!affordable || !nextItem) return;
          e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
        }}
      >
        {!nextItem ? (
          /* ── MAXED ── */
          <div
            style={{
              padding: '10px 6px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✅</span>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#4caf50',
                letterSpacing: '0.06em',
              }}
            >
              MAXED
            </div>
            <div
              style={{
                fontSize: '0.63rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {currentLabel}
            </div>
          </div>
        ) : (
          /* ── Normal / Not affordable ── */
          <div
            style={{
              padding: '8px 8px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Current state */}
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}
            >
              {currentLabel}
            </div>

            {/* Next upgrade name */}
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {nextItem.label}
            </div>

            {/* Cost */}
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: affordable ? 'var(--accent-gold)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginTop: 2,
              }}
            >
              <span style={{ fontSize: '0.8em' }}>🍌</span>
              <span>{nextItem.cost.toLocaleString()}</span>
            </div>

            {/* Progress bar — always visible */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '7px',
                background: 'rgba(0,0,0,0.07)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: affordable
                    ? 'linear-gradient(to right, #ffe57a, #f4b400)'
                    : 'linear-gradient(to right, #ddd0a0, #c8a830)',
                  transition: 'width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow:
                    affordable && progress > 10
                      ? '0 0 8px rgba(244,180,0,0.55)'
                      : 'none',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradeGroupCard;

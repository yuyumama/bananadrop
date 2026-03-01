function UpgradeGroupCard({
  group,
  currentLabel,
  nextItem,
  affordable,
  onBuy,
  score,
  level,
}) {
  const progress = nextItem
    ? Math.min(100, (score / nextItem.cost) * 100)
    : 100;
  const isMaxed = !nextItem;

  // Split "🍌 クリック" → icon + name
  const spaceIdx = group.label.indexOf(' ');
  const icon = spaceIdx >= 0 ? group.label.slice(0, spaceIdx) : group.label;
  const name = spaceIdx >= 0 ? group.label.slice(spaceIdx + 1) : '';

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 12,
          border: `1.5px solid ${
            isMaxed
              ? 'rgba(76,175,80,0.35)'
              : affordable
                ? 'var(--accent-gold)'
                : 'rgba(0,0,0,0.08)'
          }`,
          background: isMaxed
            ? 'linear-gradient(160deg, #f2fde8, #e8f5e1)'
            : affordable
              ? 'linear-gradient(160deg, #fffef5, #fff8d9)'
              : 'rgba(255,255,255,0.85)',
          boxShadow:
            affordable && !isMaxed
              ? '0 2px 12px rgba(212,175,55,0.22)'
              : '0 1px 4px rgba(0,0,0,0.06)',
          cursor: nextItem && affordable ? 'pointer' : 'default',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          userSelect: 'none',
          animation:
            affordable && !isMaxed
              ? 'upgradeGlow 2.4s ease-in-out infinite'
              : 'none',
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
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,175,55,0.32)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = affordable
            ? '0 2px 12px rgba(212,175,55,0.22)'
            : '0 1px 4px rgba(0,0,0,0.06)';
        }}
        onMouseDown={(e) => {
          if (!affordable || !nextItem) return;
          e.currentTarget.style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          if (!affordable || !nextItem) return;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
      >
        {/* Shimmer overlay when affordable */}
        {affordable && !isMaxed && (
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background:
                'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
              transform: 'rotate(45deg)',
              animation: 'shimmer 3s infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* Header: icon + name + level badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px 7px 4px',
            borderBottom: `1px solid ${
              isMaxed
                ? 'rgba(76,175,80,0.12)'
                : affordable
                  ? 'rgba(212,175,55,0.18)'
                  : 'rgba(0,0,0,0.05)'
            }`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{icon}</span>
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 700,
                color: isMaxed ? '#4caf50' : 'var(--text-muted)',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
          </div>
          {/* Level badge */}
          <div
            style={{
              fontSize: '0.52rem',
              fontWeight: 800,
              color: isMaxed
                ? '#4caf50'
                : affordable
                  ? 'var(--accent-gold)'
                  : 'rgba(0,0,0,0.3)',
              background: isMaxed
                ? 'rgba(76,175,80,0.1)'
                : affordable
                  ? 'rgba(212,175,55,0.14)'
                  : 'rgba(0,0,0,0.05)',
              borderRadius: 5,
              padding: '1px 5px',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Lv.{level}
          </div>
        </div>

        {/* Body */}
        {isMaxed ? (
          /* ── MAXED ── */
          <div
            style={{
              padding: '8px 6px 9px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>✅</span>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#4caf50',
                letterSpacing: '0.08em',
              }}
            >
              MAXED
            </div>
            <div
              style={{
                fontSize: '0.6rem',
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
          /* ── Normal ── */
          <div
            style={{
              padding: '6px 8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Current state */}
            <div
              style={{
                fontSize: '0.59rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              {currentLabel}
            </div>

            {/* Next upgrade name */}
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {nextItem.label}
            </div>

            {/* Cost pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                background: affordable
                  ? 'rgba(212,175,55,0.15)'
                  : 'rgba(0,0,0,0.05)',
                border: `1px solid ${affordable ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
                borderRadius: 20,
                padding: '2px 7px',
                marginTop: 1,
              }}
            >
              <span style={{ fontSize: '0.7em', lineHeight: 1 }}>🍌</span>
              <span
                style={{
                  fontSize: '0.63rem',
                  fontWeight: 700,
                  color: affordable
                    ? 'var(--accent-gold)'
                    : 'var(--text-muted)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {nextItem.cost.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!isMaxed && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
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
                    ? '0 0 10px rgba(244,180,0,0.65)'
                    : 'none',
                borderRadius: progress >= 99 ? 0 : '0 3px 3px 0',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradeGroupCard;

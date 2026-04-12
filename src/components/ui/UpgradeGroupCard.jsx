import styles from './UpgradeGroupCard.module.css';

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
    <div className={styles.wrapper}>
      <button
        className={styles.card}
        disabled={!nextItem || !affordable}
        aria-label={
          isMaxed
            ? `${group.label} - 最大レベル`
            : nextItem
              ? `${group.label} Lv.${level} → ${nextItem.label}、コスト: ${nextItem.cost.toLocaleString()}`
              : undefined
        }
        style={{
          border: `1.5px solid ${
            isMaxed
              ? 'var(--status-maxed-border)'
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
          animation:
            affordable && !isMaxed
              ? 'upgradeGlow 2.4s ease-in-out infinite'
              : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (nextItem && affordable) onBuy(nextItem);
        }}
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
        {affordable && !isMaxed && <div className={styles.shimmer} />}

        {/* Header */}
        <div
          className={styles.header}
          style={{
            borderBottom: `1px solid ${
              isMaxed
                ? 'var(--status-maxed-bg)'
                : affordable
                  ? 'rgba(212,175,55,0.18)'
                  : 'rgba(0,0,0,0.05)'
            }`,
          }}
        >
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>{icon}</span>
            <span
              className={`upgrade-card-header-name ${styles.headerName}`}
              style={{
                color: isMaxed ? 'var(--status-maxed)' : 'var(--text-muted)',
              }}
            >
              {name}
            </span>
          </div>
          <div
            className={styles.levelBadge}
            style={{
              color: isMaxed
                ? '#4caf50'
                : affordable
                  ? 'var(--accent-gold)'
                  : 'rgba(0,0,0,0.3)',
              background: isMaxed
                ? 'var(--status-maxed-bg)'
                : affordable
                  ? 'rgba(212,175,55,0.14)'
                  : 'rgba(0,0,0,0.05)',
            }}
          >
            Lv.{level}
          </div>
        </div>

        {/* Body */}
        {isMaxed ? (
          <div className={styles.bodyMaxed}>
            <span className={styles.maxedIcon}>✅</span>
            <div className={styles.maxedLabel}>MAXED</div>
            <div className={styles.maxedDescription}>{currentLabel}</div>
          </div>
        ) : (
          <div className={styles.bodyNormal}>
            <div className={`upgrade-card-body-label ${styles.currentLabel}`}>
              {currentLabel}
            </div>
            <div className={`upgrade-card-body-next ${styles.nextLabel}`}>
              {nextItem.label}
            </div>
            <div
              className={`upgrade-card-cost-pill ${styles.costPill}`}
              style={{
                background: affordable
                  ? 'rgba(212,175,55,0.15)'
                  : 'rgba(0,0,0,0.05)',
                border: `1px solid ${affordable ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
              }}
            >
              <span className={styles.costEmoji}>🍌</span>
              <span
                className={styles.costValue}
                style={{
                  color: affordable
                    ? 'var(--accent-gold)'
                    : 'var(--text-muted)',
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
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name} アップグレード進捗`}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: affordable
                  ? 'linear-gradient(to right, var(--accent-gold-light), var(--accent-gold))'
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
      </button>
    </div>
  );
}

export default UpgradeGroupCard;

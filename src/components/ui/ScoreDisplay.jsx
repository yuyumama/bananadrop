import styles from './ScoreDisplay.module.css';

function ScoreDisplay({ score, perSecond, scoreBump, devMode }) {
  const animClass = scoreBump
    ? styles.bump
    : perSecond > 0
      ? styles.breathing
      : '';

  return (
    <div
      className={`glass-panel score-display ${styles.root} ${animClass}`}
      role="status"
      aria-label={`スコア: ${score.toLocaleString()}、毎秒 ${perSecond.toLocaleString()} ポイント`}
      aria-live="polite"
    >
      <div className={styles.row}>
        <span className={styles.icon} aria-hidden="true">
          🍌
        </span>
        <span className={`score-value ${styles.value}`}>
          {score.toLocaleString()}
        </span>
        {devMode && <span className={styles.studioBadge}>STUDIO</span>}
      </div>
      <div className={styles.perSecondRow}>
        <span className={styles.perSecondValue}>
          +{perSecond.toLocaleString()}
        </span>
        <span className={`per-second-label ${styles.perSecondLabel}`}>/秒</span>
      </div>
    </div>
  );
}

export default ScoreDisplay;

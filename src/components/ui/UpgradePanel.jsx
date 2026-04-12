import UpgradeGroupCard from './UpgradeGroupCard';
import { buildGroupUpgradeViewModel } from '../../services/upgradeRules';
import styles from './UpgradePanel.module.css';

function UpgradePanel({ groups, purchased, score, onBuy, devMode }) {
  return (
    <nav
      className={`glass-panel upgrade-panel ${styles.root}`}
      aria-label="アップグレード"
    >
      {groups.map((group) => {
        const { currentLabel, nextItem, affordable, level, maxLevel } =
          buildGroupUpgradeViewModel({
            group,
            purchased,
            score,
            devMode,
          });

        return (
          <UpgradeGroupCard
            key={group.key}
            group={group}
            currentLabel={currentLabel}
            nextItem={nextItem}
            affordable={affordable}
            onBuy={onBuy}
            score={score}
            level={level}
            maxLevel={maxLevel}
          />
        );
      })}
    </nav>
  );
}

export default UpgradePanel;

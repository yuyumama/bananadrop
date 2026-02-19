import UpgradeGroupCard from './UpgradeGroupCard';
import { buildGroupUpgradeViewModel } from '../../services/upgradeRules';

function UpgradePanel({ groups, purchased, score, onBuy }) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '6px 12px 8px',
        display: 'flex',
        gap: 8,
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderBottom: 'none',
      }}
    >
      {groups.map((group) => {
        const { currentLabel, nextItem, affordable } =
          buildGroupUpgradeViewModel({
            group,
            purchased,
            score,
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
          />
        );
      })}
    </div>
  );
}

export default UpgradePanel;

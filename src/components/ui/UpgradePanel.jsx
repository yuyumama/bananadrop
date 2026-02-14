import UpgradeGroupCard from './UpgradeGroupCard';
import { buildGroupUpgradeViewModel } from '../../services/upgradeRules';

function UpgradePanel({ groups, purchased, score, onBuy }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'rgba(255,255,255,0.93)',
        borderTop: '1.5px solid rgba(0,0,0,0.08)',
        padding: '8px 8px 10px',
        display: 'flex',
        gap: 6,
        backdropFilter: 'blur(10px)',
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
          />
        );
      })}
    </div>
  );
}

export default UpgradePanel;

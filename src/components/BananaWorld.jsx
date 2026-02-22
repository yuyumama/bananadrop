import { useRef, useMemo } from 'react';
import TrayVisual from './ui/TrayVisual';
import useAutoSpawn from '../hooks/useAutoSpawn';
import useLatestRef from '../hooks/useLatestRef';
import useMatterBananaWorld from '../hooks/useMatterBananaWorld';
import { getTablePx } from '../services/bananaWorldGeometry';

const TABLE_HEIGHT = 20;
const TABLE_WIDTH_RATIO = 0.4;
const RIM_RISE = 40;

const BananaWorld = ({
  bananaPerClick = 1,
  autoSpawnRate = 0,
  panelHeight = 80,
  unlockedTiers = [],
  onScore,
  giantChance = 0,
  tableWidth = TABLE_WIDTH_RATIO,
}) => {
  const sceneRef = useRef(null);
  const barVisualRef = useRef(null);
  const barWidth = useMemo(() => getTablePx(tableWidth), [tableWidth]);
  const bananaPerClickRef = useLatestRef(bananaPerClick);
  const onScoreRef = useLatestRef(onScore);
  const unlockedTiersRef = useLatestRef(unlockedTiers);
  const panelHeightRef = useLatestRef(panelHeight);
  const giantChanceRef = useLatestRef(giantChance);
  const tableWidthRef = useLatestRef(tableWidth);

  const { spawnBanana } = useMatterBananaWorld({
    sceneRef,
    barVisualRef,
    panelHeightRef,
    tableWidthRef,
    unlockedTiersRef,
    giantChanceRef,
    onScoreRef,
    tableWidth,
  });

  useAutoSpawn({ autoSpawnRate, spawnBanana });

  const handleDataClick = (e) => {
    let x;
    if (e && e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
    } else if (e && e.clientX !== undefined) {
      x = e.clientX;
    } else {
      x = Math.random() * window.innerWidth;
    }

    const count = bananaPerClickRef.current;
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 40;
      spawnBanana(x + offset);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* HTMLバー：おぼん型（全体が1本の緩やかなカーブ） */}
      <TrayVisual
        ref={barVisualRef}
        barWidth={barWidth}
        rimRise={RIM_RISE}
        tableHeight={TABLE_HEIGHT}
      />
      {/* Matter.jsキャンバス（バナナはここに描画、バーより前） */}
      <div
        ref={sceneRef}
        onClick={handleDataClick}
        onTouchStart={(e) => {
          handleDataClick(e);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          touchAction: 'none',
          zIndex: 2,
          filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))', // Soft shadow for bananas
        }}
      />
    </div>
  );
};

export default BananaWorld;

import { useRef, useMemo } from 'react';
import TrayVisual from './ui/TrayVisual';
import useAutoSpawn from '../hooks/useAutoSpawn';
import useLatestRef from '../hooks/useLatestRef';
import useMatterBananaWorld from '../hooks/useMatterBananaWorld';
import { getTablePx } from '../services/bananaWorldGeometry';
import { SHOP_ITEMS } from '../data/shopItems';

const TABLE_HEIGHT = 20;
const TABLE_WIDTH_RATIO = 0.4;
const RIM_RISE = 40;

const resolvePointerX = (event) => {
  if (event && event.touches && event.touches.length > 0) {
    return event.touches[0].clientX;
  }

  if (event && event.clientX !== undefined) {
    return event.clientX;
  }

  return Math.random() * window.innerWidth;
};

const BananaWorld = ({
  bananaPerClick = 1,
  autoSpawnRate = 0,
  panelHeight = 80,
  unlockedTiers = [],
  onScore,
  onEffect,
  giantChance = 0,
  tableWidth = TABLE_WIDTH_RATIO,
  shopPurchases = {},
  devMode = false,
}) => {
  const sceneRef = useRef(null);
  const barVisualRef = useRef(null);
  const barWidth = useMemo(() => getTablePx(tableWidth), [tableWidth]);
  const bananaPerClickRef = useLatestRef(bananaPerClick);
  const onScoreRef = useLatestRef(onScore);
  const onEffectRef = useLatestRef(onEffect);
  const unlockedTiersRef = useLatestRef(unlockedTiers);
  const panelHeightRef = useLatestRef(panelHeight);
  const giantChanceRef = useLatestRef(giantChance);
  const tableWidthRef = useLatestRef(tableWidth);
  const shopPurchasesRef = useLatestRef(shopPurchases);

  const { spawnBanana, spawnSpecialBanana } = useMatterBananaWorld({
    sceneRef,
    barVisualRef,
    panelHeightRef,
    tableWidthRef,
    unlockedTiersRef,
    giantChanceRef,
    onScoreRef,
    onEffectRef,
    tableWidth,
  });

  useAutoSpawn({
    autoSpawnRate,
    spawnBanana,
    spawnSpecialBanana,
    shopPurchasesRef,
  });

  const handleDataClick = (e) => {
    const x = resolvePointerX(e);
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
      {/* 開発者モード: 特殊バナナ即スポーンボタン（SHOP_ITEMS から自動生成） */}
      {devMode && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: 8,
            pointerEvents: 'auto',
          }}
        >
          {SHOP_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                spawnSpecialBanana(window.innerWidth / 2, item);
              }}
              style={{
                padding: '6px 14px',
                background: 'rgba(255,140,0,0.85)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

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

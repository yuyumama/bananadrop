import {
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TrayVisual from './ui/TrayVisual';
import useAutoSpawn from '../hooks/useAutoSpawn';
import useLatestRef from '../hooks/useLatestRef';
import useMatterBananaWorld from '../hooks/useMatterBananaWorld';
import { getTablePx } from '../services/bananaWorldGeometry';
import { SHOP_ITEMS } from '../data/shopItems';

const TABLE_HEIGHT = 20;
const TABLE_WIDTH_RATIO = 0.4;
const RIM_RISE = 40;

function DebugAdjusterRow({ icon, steps, onAdjust }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px dashed rgba(212,175,55,0.5)',
        borderRadius: 20,
        padding: '4px 8px',
        boxShadow: '0 2px 8px rgba(132,122,100,0.12)',
      }}
    >
      {icon}
      {steps.map(({ label, delta }) => (
        <button
          key={label}
          onClick={(e) => {
            e.stopPropagation();
            onAdjust(delta);
          }}
          style={{
            padding: '3px 8px',
            background: 'rgba(255,255,255,0.85)',
            color: '#4a4a4a',
            fontWeight: 700,
            fontSize: '0.68rem',
            border: '1px solid rgba(212,175,55,0.35)',
            borderRadius: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(212,175,55,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(0.97)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const resolvePointerX = (event) => {
  if (event && event.touches && event.touches.length > 0) {
    return event.touches[0].clientX;
  }

  if (event && event.clientX !== undefined) {
    return event.clientX;
  }

  return Math.random() * window.innerWidth;
};

const BananaWorld = forwardRef(
  (
    {
      bananaPerClick = 1,
      autoSpawnRate = 0,
      panelHeight = 80,
      unlockedTiers = [],
      onScore,
      onEffect,
      onCoinCollected,
      giantChance = 0,
      tableWidth = TABLE_WIDTH_RATIO,
      shopPurchases = {},
      devMode = false,
      onResetUpgrades,
      onAdjustScore,
      onAdjustCoins,
      isOneKind = false,
      oneKindSelection = null,
    },
    ref,
  ) => {
    const sceneRef = useRef(null);
    const barVisualRef = useRef(null);
    const barWidth = useMemo(() => getTablePx(tableWidth), [tableWidth]);
    const bananaPerClickRef = useLatestRef(bananaPerClick);
    const onScoreRef = useLatestRef(onScore);
    const onEffectRef = useLatestRef(onEffect);
    const onCoinRef = useLatestRef(onCoinCollected);
    const unlockedTiersRef = useLatestRef(unlockedTiers);
    const panelHeightRef = useLatestRef(panelHeight);
    const giantChanceRef = useLatestRef(giantChance);
    const tableWidthRef = useLatestRef(tableWidth);
    const shopPurchasesRef = useLatestRef(shopPurchases);
    const devModeRef = useLatestRef(devMode);
    const isOneKindRef = useLatestRef(isOneKind);
    const oneKindSelectionRef = useLatestRef(oneKindSelection);

    const { spawnBanana, spawnSpecialBanana, spawnCoin } = useMatterBananaWorld(
      {
        sceneRef,
        barVisualRef,
        panelHeightRef,
        tableWidthRef,
        unlockedTiersRef,
        giantChanceRef,
        onScoreRef,
        onEffectRef,
        onCoinRef,
        tableWidth,
        devModeRef,
      },
    );

    useImperativeHandle(ref, () => ({
      spawnCoin,
    }));

    const trySpawnSpecial = useCallback(
      (x) => {
        SHOP_ITEMS.forEach((item) => {
          const count = shopPurchasesRef.current?.[item.id] ?? 0;
          if (count === 0) return;
          const chance = item.spawnChanceStacks
            ? item.spawnChancePerBanana * count
            : item.spawnChancePerBanana;
          if (Math.random() < chance) {
            spawnSpecialBanana(x, item);
          }
        });
      },
      [spawnSpecialBanana, shopPurchasesRef],
    );

    const spawnBananaWithCheck = useCallback(
      (x) => {
        const selection = isOneKindRef.current
          ? oneKindSelectionRef.current
          : null;
        if (selection) {
          if (selection.type === 'tier') {
            spawnBanana(x, [selection.tier]);
          } else if (selection.type === 'special') {
            const item = SHOP_ITEMS.find((i) => i.id === selection.itemId);
            if (item) spawnSpecialBanana(x, item);
          }
        } else {
          spawnBanana(x);
          trySpawnSpecial(x);
        }
      },
      [
        spawnBanana,
        spawnSpecialBanana,
        trySpawnSpecial,
        isOneKindRef,
        oneKindSelectionRef,
      ],
    );

    useAutoSpawn({ autoSpawnRate, spawnBanana: spawnBananaWithCheck });

    const handleDataClick = (e) => {
      const x = resolvePointerX(e);
      const count = bananaPerClickRef.current;
      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * 40;
        spawnBananaWithCheck(x + offset);
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
        {/* 開発者モード: デバッグコントロール */}
        {devMode && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              pointerEvents: 'auto',
            }}
          >
            {/* 行1: 特殊バナナ即スポーン + リセット */}
            <div style={{ display: 'flex', gap: 8 }}>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetUpgrades?.();
                }}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(220,50,50,0.85)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: 'none',
                  borderRadius: 20,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                リセット
              </button>
            </div>

            {/* 行2: スコア調整 */}
            <DebugAdjusterRow
              icon={
                <span style={{ fontSize: '1rem', color: '#d4af37', lineHeight: 1 }}>
                  🍌
                </span>
              }
              steps={[
                { label: '-100,000', delta: -100000 },
                { label: '-10,000', delta: -10000 },
                { label: '-1,000', delta: -1000 },
                { label: '+1,000', delta: 1000 },
                { label: '+10,000', delta: 10000 },
                { label: '+100,000', delta: 100000 },
              ]}
              onAdjust={onAdjustScore}
            />

            {/* 行3: バナコイン調整 */}
            <DebugAdjusterRow
              icon={
                <img
                  src={`${import.meta.env.BASE_URL}coin.png`}
                  alt="バナコイン"
                  style={{
                    width: 18,
                    height: 18,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 1px 3px rgba(212,175,55,0.5))',
                    flexShrink: 0,
                  }}
                />
              }
              steps={[
                { label: '-100', delta: -100 },
                { label: '-10', delta: -10 },
                { label: '+10', delta: 10 },
                { label: '+100', delta: 100 },
              ]}
              onAdjust={onAdjustCoins}
            />
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
  },
);

export default BananaWorld;

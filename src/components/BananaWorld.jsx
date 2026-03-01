import {
  useState,
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
import { BANANA_TIERS } from '../data/constants/bananaTiers';

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
      onSpecialSpawn,
      treeMutationRateBonus = 0,
      treeCriticalClickChance = 0,
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
    const onSpecialSpawnRef = useLatestRef(onSpecialSpawn);
    const treeMutationRateBonusRef = useLatestRef(treeMutationRateBonus);
    const treeCriticalClickChanceRef = useLatestRef(treeCriticalClickChance);

    // デバッグ用: スポーンするバナナの種類を固定
    // null = OFF, { type: 'tier', tier: tierObj } or { type: 'special', item: shopItem }
    const [debugForcedBanana, setDebugForcedBanana] = useState(null);
    const debugForcedBananaRef = useLatestRef(debugForcedBanana);

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
          let chance = item.spawnChanceStacks
            ? item.spawnChancePerBanana * count
            : item.spawnChancePerBanana;
          chance *= 1 + treeMutationRateBonusRef.current;
          if (Math.random() < chance) {
            spawnSpecialBanana(x, item);
            onSpecialSpawnRef.current?.(x, item.id);
          }
        });
      },
      [
        spawnSpecialBanana,
        shopPurchasesRef,
        onSpecialSpawnRef,
        treeMutationRateBonusRef,
      ],
    );

    const spawnBananaWithCheck = useCallback(
      (x) => {
        // デバッグモード: 固定バナナが選択されている場合
        const forced = debugForcedBananaRef.current;
        if (forced) {
          if (forced.type === 'tier') {
            spawnBanana(x, [forced.tier]);
          } else if (forced.type === 'special') {
            spawnSpecialBanana(x, forced.item);
            onSpecialSpawnRef.current?.(x, forced.item.id);
          }
          return;
        }

        const selection = isOneKindRef.current
          ? oneKindSelectionRef.current
          : null;
        if (selection) {
          if (selection.type === 'tier') {
            spawnBanana(x, [selection.tier]);
          } else if (selection.type === 'special') {
            const item = SHOP_ITEMS.find((i) => i.id === selection.itemId);
            if (item) {
              spawnSpecialBanana(x, item);
              onSpecialSpawnRef.current?.(x, item.id);
            }
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
        onSpecialSpawnRef,
        debugForcedBananaRef,
      ],
    );

    useAutoSpawn({ autoSpawnRate, spawnBanana: spawnBananaWithCheck });

    const handleDataClick = (e) => {
      const x = resolvePointerX(e);

      // デバッグ固定バナナ選択中は1つだけスポーン
      if (debugForcedBananaRef.current) {
        spawnBananaWithCheck(x);
        return;
      }

      const isCritical = Math.random() < treeCriticalClickChanceRef.current;
      const count = bananaPerClickRef.current + (isCritical ? 30 : 0);
      for (let i = 0; i < count; i++) {
        let offset = 0;
        if (isCritical && i >= bananaPerClickRef.current) {
          offset = (Math.random() - 0.5) * 150;
        } else {
          offset = (i - (bananaPerClickRef.current - 1) / 2) * 40;
        }
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
            {/* 行1: バナナスポーン種類セレクター */}
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
                padding: '4px 6px',
                boxShadow: '0 2px 8px rgba(132,122,100,0.12)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '90vw',
              }}
            >
              {/* OFF ボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDebugForcedBanana(null);
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  padding: '3px 4px',
                  background: !debugForcedBanana
                    ? 'rgba(212,175,55,0.3)'
                    : 'rgba(255,255,255,0.85)',
                  color: '#4a4a4a',
                  fontWeight: 700,
                  fontSize: '0.55rem',
                  border: !debugForcedBanana
                    ? '1.5px solid rgba(212,175,55,0.7)'
                    : '1.5px solid rgba(212,175,55,0.35)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: 36,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    display: 'block',
                    height: 20,
                    lineHeight: '20px',
                  }}
                >
                  🚫
                </span>
                <span>OFF</span>
              </button>

              {/* 通常バナナ12種 */}
              {BANANA_TIERS.map((tier) => {
                const isSelected =
                  debugForcedBanana?.type === 'tier' &&
                  debugForcedBanana.tier.tier === tier.tier;
                return (
                  <button
                    key={`tier-${tier.tier}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDebugForcedBanana({ type: 'tier', tier });
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
                      e.currentTarget.style.transform =
                        'translateY(0) scale(0.97)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px) scale(1)';
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      padding: '3px 4px',
                      background: isSelected
                        ? 'rgba(212,175,55,0.3)'
                        : 'rgba(255,255,255,0.85)',
                      color: '#4a4a4a',
                      fontWeight: 700,
                      fontSize: '0.55rem',
                      border: isSelected
                        ? '1.5px solid rgba(212,175,55,0.7)'
                        : '1.5px solid rgba(212,175,55,0.35)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      minWidth: 36,
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${tier.icon}`}
                      alt={tier.name}
                      style={{
                        width: 20,
                        height: 20,
                        objectFit: 'contain',
                      }}
                    />
                    <span>{tier.name}</span>
                  </button>
                );
              })}

              {/* スペシャルバナナ4種 */}
              {SHOP_ITEMS.map((item) => {
                const isSelected =
                  debugForcedBanana?.type === 'special' &&
                  debugForcedBanana.item.id === item.id;
                return (
                  <button
                    key={`special-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDebugForcedBanana({ type: 'special', item });
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(255,140,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(0.97)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px) scale(1)';
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      padding: '3px 4px',
                      background: isSelected
                        ? 'rgba(255,140,0,0.3)'
                        : 'rgba(255,255,255,0.85)',
                      color: '#4a4a4a',
                      fontWeight: 700,
                      fontSize: '0.55rem',
                      border: isSelected
                        ? '1.5px solid rgba(255,140,0,0.7)'
                        : '1.5px solid rgba(212,175,55,0.35)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      minWidth: 36,
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${item.icon}`}
                      alt={item.label}
                      style={{
                        width: 20,
                        height: 20,
                        objectFit: 'contain',
                      }}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 行2: スコア調整 */}
            <DebugAdjusterRow
              icon={
                <span
                  style={{ fontSize: '1rem', color: '#d4af37', lineHeight: 1 }}
                >
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

            {/* 行3: バナコイン調整 + リセット */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetUpgrades?.();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(220,50,50,0.25)';
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
                style={{
                  padding: '3px 8px',
                  background: 'rgba(255,255,255,0.85)',
                  color: '#c33',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  border: '1px solid rgba(220,50,50,0.4)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                🔄 リセット
              </button>
            </div>
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

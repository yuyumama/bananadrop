import {
  useState,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TrayVisual from './ui/TrayVisual';
import DebugPanel from './ui/DebugPanel';
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
    const isOneKindRef = useLatestRef(isOneKind);
    const oneKindSelectionRef = useLatestRef(oneKindSelection);
    const onSpecialSpawnRef = useLatestRef(onSpecialSpawn);
    const treeMutationRateBonusRef = useLatestRef(treeMutationRateBonus);
    const treeCriticalClickChanceRef = useLatestRef(treeCriticalClickChance);

    // デバッグ用: スポーンするバナナの種類を固定
    // null = OFF, { type: 'tier', tier: tierObj } or { type: 'special', item: shopItem }
    const [debugForcedBanana, setDebugForcedBanana] = useState(null);
    const debugForcedBananaRef = useLatestRef(debugForcedBanana);

    // デバッグ用: 当たり判定ポリゴンの表示切替
    const [showCollisionBounds, setShowCollisionBounds] = useState(true);
    const showCollisionBoundsRef = useLatestRef(devMode && showCollisionBounds);

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
        showCollisionBoundsRef,
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
          <DebugPanel
            debugForcedBanana={debugForcedBanana}
            onSelectForcedBanana={setDebugForcedBanana}
            onAdjustScore={onAdjustScore}
            onAdjustCoins={onAdjustCoins}
            onResetUpgrades={onResetUpgrades}
            showCollisionBounds={showCollisionBounds}
            onToggleCollisionBounds={() => setShowCollisionBounds((v) => !v)}
          />
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

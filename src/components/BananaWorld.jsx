import { useEffect, useRef, useCallback, useMemo } from 'react';
import Matter from 'matter-js';
import TrayVisual from './ui/TrayVisual';
import useAutoSpawn from '../hooks/useAutoSpawn';
import useLatestRef from '../hooks/useLatestRef';
import {
  calcBarCenterY,
  getTablePx,
  rimAngle,
  rimLength,
  rimSpread,
} from '../services/bananaWorldGeometry';
import { createBananaBody } from '../services/bananaFactory';
import { collectBananaOutcome } from '../services/bananaScore';

const TABLE_HEIGHT = 20;
const TABLE_WIDTH_RATIO = 0.4;
const TABLE_MOVE_HZ = 0.08; // 約12.5秒で1往復
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
  const engineRef = useRef(null);
  const bananaPerClickRef = useLatestRef(bananaPerClick);
  const onScoreRef = useLatestRef(onScore);
  const unlockedTiersRef = useLatestRef(unlockedTiers);
  const panelHeightRef = useLatestRef(panelHeight);
  const giantChanceRef = useLatestRef(giantChance);
  const tableRef = useRef(null);
  const rimLeftRef = useRef(null);
  const rimRightRef = useRef(null);
  const tableWidthRef = useLatestRef(tableWidth);

  const addRims = useCallback((world, cx, cy, tw) => {
    const opts = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 0,
      },
      friction: 1.0,
      frictionStatic: 10.0,
      restitution: 0.0,
      label: 'rim',
    };
    const rs = rimSpread(tw);
    const sy = cy - TABLE_HEIGHT / 2;
    rimLeftRef.current = Matter.Bodies.rectangle(
      cx - tw / 2 + rs / 2,
      sy - RIM_RISE / 2,
      rimLength(tw),
      TABLE_HEIGHT,
      { ...opts, angle: rimAngle(tw) },
    );
    rimRightRef.current = Matter.Bodies.rectangle(
      cx + tw / 2 - rs / 2,
      sy - RIM_RISE / 2,
      rimLength(tw),
      TABLE_HEIGHT,
      { ...opts, angle: -rimAngle(tw) },
    );
    Matter.Composite.add(world, [rimLeftRef.current, rimRightRef.current]);
  }, []);

  const removeRims = useCallback((world) => {
    if (rimLeftRef.current) Matter.Composite.remove(world, rimLeftRef.current);
    if (rimRightRef.current)
      Matter.Composite.remove(world, rimRightRef.current);
  }, []);

  const syncRims = useCallback((cx, cy, tw) => {
    const rs = rimSpread(tw);
    const sy = cy - TABLE_HEIGHT / 2;
    if (rimLeftRef.current)
      Matter.Body.setPosition(rimLeftRef.current, {
        x: cx - tw / 2 + rs / 2,
        y: sy - RIM_RISE / 2,
      });
    if (rimRightRef.current)
      Matter.Body.setPosition(rimRightRef.current, {
        x: cx + tw / 2 - rs / 2,
        y: sy - RIM_RISE / 2,
      });
  }, []);

  // tableWidth変更時にテーブルを再生成
  useEffect(() => {
    if (!engineRef.current || !tableRef.current) return;
    const oldTable = tableRef.current;
    const oldX = oldTable.position.x;
    const oldY = oldTable.position.y;
    Matter.Composite.remove(engineRef.current.world, oldTable);
    const newTableW = getTablePx(tableWidth);
    const newTable = Matter.Bodies.rectangle(
      oldX,
      oldY,
      newTableW,
      TABLE_HEIGHT,
      {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0,
        },
        friction: 1.0,
        frictionStatic: 10.0,
        restitution: 0.0,
        label: 'table',
      },
    );
    tableRef.current = newTable;
    Matter.Composite.add(engineRef.current.world, newTable);
    removeRims(engineRef.current.world);
    addRims(engineRef.current.world, oldX, oldY, newTableW);
    if (barVisualRef.current)
      barVisualRef.current.style.width = `${newTableW}px`;
  }, [tableWidth, addRims, removeRims]);

  const spawnBanana = useCallback((x) => {
    if (!engineRef.current) return;

    const y = -200;
    const banana = createBananaBody({
      x,
      y,
      tiers: unlockedTiersRef.current,
      giantChance: giantChanceRef.current,
      viewportWidth: window.innerWidth,
      baseUrl: import.meta.env.BASE_URL,
    });
    Matter.Composite.add(engineRef.current.world, banana);
  }, [giantChanceRef, unlockedTiersRef]);

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    // バーの中心Y（ボタンパネルのすぐ上）
    const barCenterY = () =>
      calcBarCenterY(
        window.innerHeight,
        panelHeightRef.current,
        TABLE_HEIGHT,
      );

    const tableW = getTablePx(tableWidthRef.current);
    const table = Bodies.rectangle(
      window.innerWidth / 2,
      barCenterY(),
      tableW,
      TABLE_HEIGHT,
      {
        isStatic: true,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0,
        },
        friction: 1.0,
        frictionStatic: 10.0,
        restitution: 0.0,
        label: 'table',
      },
    );
    tableRef.current = table;
    Composite.add(engine.world, [table]);
    addRims(engine.world, window.innerWidth / 2, barCenterY(), tableW);

    // HTMLバーの位置を同期する関数
    const syncBar = (x, y) => {
      if (!barVisualRef.current) return;
      const tw = getTablePx(tableWidthRef.current);
      barVisualRef.current.style.left = `${x - tw / 2}px`;
      barVisualRef.current.style.top = `${y - TABLE_HEIGHT / 2 - RIM_RISE}px`;
      barVisualRef.current.style.width = `${tw}px`;
    };
    syncBar(window.innerWidth / 2, barCenterY());

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // BANANA テキストリビール
    const bananaCapture = document.createElement('canvas');
    const textWork = document.createElement('canvas');
    bananaCapture.width = window.innerWidth;
    bananaCapture.height = window.innerHeight;
    textWork.width = window.innerWidth;
    textWork.height = window.innerHeight;
    const captureCtx = bananaCapture.getContext('2d');
    const textCtx = textWork.getContext('2d');

    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const w = render.canvas.width;
      const h = render.canvas.height;

      captureCtx.clearRect(0, 0, w, h);
      captureCtx.drawImage(render.canvas, 0, 0);

      textCtx.clearRect(0, 0, w, h);
      textCtx.globalCompositeOperation = 'source-over';
      textCtx.font = `900 ${w * 0.18}px "Outfit", sans-serif`;
      textCtx.fillStyle = 'rgba(74, 74, 74, 0.95)'; // var(--text-main) equivalent
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText('BANANA', w / 2, h / 2);
      textCtx.globalCompositeOperation = 'destination-in';
      textCtx.drawImage(bananaCapture, 0, 0);
      textCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(textWork, 0, 0);
    });

    // 自動左右移動
    // setPosition だけでは静的ボディの速度が0扱いになり摩擦が効かない
    // → setVelocity も合わせて呼ぶことで摩擦計算に速度を反映させる
    const startTime = Date.now();
    let prevBarX = window.innerWidth / 2;
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (!tableRef.current) return;
      const tw = getTablePx(tableWidthRef.current);
      const minX = tw / 2;
      const maxX = window.innerWidth - tw / 2;
      const centerX = window.innerWidth / 2;
      const amplitude = (maxX - minX) / 2;
      const elapsed = (Date.now() - startTime) / 1000;
      const newX =
        centerX + Math.sin(elapsed * Math.PI * TABLE_MOVE_HZ * 2) * amplitude;
      const clampedX = Math.max(minX, Math.min(maxX, newX));
      const y = tableRef.current.position.y;
      const vx = clampedX - prevBarX;
      prevBarX = clampedX;

      Matter.Body.setPosition(tableRef.current, { x: clampedX, y });
      Matter.Body.setVelocity(tableRef.current, { x: vx, y: 0 });
      syncRims(clampedX, y, tw);
      syncBar(clampedX, y);
    });

    // 下落下 → スコア、左右アウト → ロス
    Matter.Events.on(engine, 'afterUpdate', () => {
      const bodies = Composite.allBodies(engine.world);
      const bananas = bodies.filter((b) => b.label === 'banana');
      const { scoreItems, scoredBodies, lostBodies } = collectBananaOutcome({
        bananas,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      });

      scoredBodies.forEach((b) => Matter.Composite.remove(engine.world, b));
      lostBodies.forEach((b) => Composite.remove(engine.world, b));
      if (scoreItems.length > 0) onScoreRef.current?.(scoreItems);
    });

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      bananaCapture.width = window.innerWidth;
      bananaCapture.height = window.innerHeight;
      textWork.width = window.innerWidth;
      textWork.height = window.innerHeight;

      if (tableRef.current) {
        Composite.remove(engine.world, tableRef.current);
        const newTableW = getTablePx(tableWidthRef.current);
        const newTable = Bodies.rectangle(
          window.innerWidth / 2,
          barCenterY(),
          newTableW,
          TABLE_HEIGHT,
          {
            isStatic: true,
            render: {
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
            },
            friction: 1.0,
            frictionStatic: 10.0,
            restitution: 0.0,
            label: 'table',
          },
        );
        tableRef.current = newTable;
        Composite.add(engine.world, newTable);
        removeRims(engine.world);
        addRims(engine.world, window.innerWidth / 2, barCenterY(), newTableW);
        syncBar(window.innerWidth / 2, barCenterY());
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      window.removeEventListener('resize', handleResize);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [addRims, onScoreRef, panelHeightRef, removeRims, syncRims, tableWidthRef]);

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

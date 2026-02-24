import { useCallback, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import {
  createBananaBody,
  createSpecialBananaBody,
} from '../services/bananaFactory';
import {
  calcBarCenterY,
  getTablePx,
  rimAngle,
  rimLength,
  rimSpread,
} from '../services/bananaWorldGeometry';
import { collectBananaOutcome } from '../services/bananaScore';

const TABLE_HEIGHT = 20;
const TABLE_MOVE_HZ = 0.08; // 約12.5秒で1往復
const RIM_RISE = 40;

const createTableBody = (x, y, tableWidth) =>
  Matter.Bodies.rectangle(x, y, tableWidth, TABLE_HEIGHT, {
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
  });

export default function useMatterBananaWorld({
  sceneRef,
  barVisualRef,
  panelHeightRef,
  tableWidthRef,
  unlockedTiersRef,
  giantChanceRef,
  onScoreRef,
  onEffectRef,
  tableWidth,
}) {
  const engineRef = useRef(null);
  const tableRef = useRef(null);
  const rimLeftRef = useRef(null);
  const rimRightRef = useRef(null);

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

  const spawnBanana = useCallback(
    (x) => {
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
    },
    [giantChanceRef, unlockedTiersRef],
  );

  const spawnSpecialBanana = useCallback((x, item) => {
    if (!engineRef.current) return;
    const body = createSpecialBananaBody({
      x,
      y: -200,
      item,
      viewportWidth: window.innerWidth,
      baseUrl: import.meta.env.BASE_URL,
    });
    Matter.Composite.add(engineRef.current.world, body);
  }, []);

  // tableWidth変更時にテーブルを再生成
  useEffect(() => {
    if (!engineRef.current || !tableRef.current) return;

    const oldTable = tableRef.current;
    const oldX = oldTable.position.x;
    const oldY = oldTable.position.y;
    Matter.Composite.remove(engineRef.current.world, oldTable);

    const newTableW = getTablePx(tableWidth);
    const newTable = createTableBody(oldX, oldY, newTableW);
    tableRef.current = newTable;
    Matter.Composite.add(engineRef.current.world, newTable);
    removeRims(engineRef.current.world);
    addRims(engineRef.current.world, oldX, oldY, newTableW);

    if (barVisualRef.current) {
      barVisualRef.current.style.width = `${newTableW}px`;
    }
  }, [addRims, barVisualRef, removeRims, tableWidth]);

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
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

    const barCenterY = () =>
      calcBarCenterY(window.innerHeight, panelHeightRef.current, TABLE_HEIGHT);

    const syncBar = (x, y) => {
      if (!barVisualRef.current) return;
      const tw = getTablePx(tableWidthRef.current);
      barVisualRef.current.style.left = `${x - tw / 2}px`;
      barVisualRef.current.style.top = `${y - TABLE_HEIGHT / 2 - RIM_RISE}px`;
      barVisualRef.current.style.width = `${tw}px`;
    };

    const tableW = getTablePx(tableWidthRef.current);
    const table = createTableBody(window.innerWidth / 2, barCenterY(), tableW);
    tableRef.current = table;
    Composite.add(engine.world, [table]);
    addRims(engine.world, window.innerWidth / 2, barCenterY(), tableW);
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

    // 下落下 → スコア/効果発動、左右アウト → ロス
    Matter.Events.on(engine, 'afterUpdate', () => {
      const bodies = Composite.allBodies(engine.world);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 通常バナナ
      const bananas = bodies.filter((b) => b.label === 'banana');
      const { scoreItems, scoredBodies, lostBodies } = collectBananaOutcome({
        bananas,
        screenWidth: w,
        screenHeight: h,
      });
      scoredBodies.forEach((b) => Matter.Composite.remove(engine.world, b));
      lostBodies.forEach((b) => Composite.remove(engine.world, b));
      if (scoreItems.length > 0) onScoreRef.current?.(scoreItems);

      // 特殊バナナ：画面下に落ちたら効果発動、横に出たら消去
      const specials = bodies.filter((b) => b.label === 'special_banana');
      specials.forEach((b) => {
        if (b.position.y > h + 200) {
          Composite.remove(engine.world, b);
          onEffectRef.current?.(b.shopItemId, {
            x: b.position.x,
            y: h - 20,
          });
        } else if (b.position.x < -200 || b.position.x > w + 200) {
          Composite.remove(engine.world, b);
        }
      });
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
        const newTable = createTableBody(
          window.innerWidth / 2,
          barCenterY(),
          newTableW,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onEffectRef は ref なので依存不要
  }, [
    addRims,
    barVisualRef,
    onScoreRef,
    panelHeightRef,
    removeRims,
    sceneRef,
    syncRims,
    tableWidthRef,
  ]);

  return { spawnBanana, spawnSpecialBanana };
}

import { useCallback, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import {
  createBananaBody,
  createSpecialBananaBody,
  createCoinBody,
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
  onCoinRef,
  tableWidth,
  devModeRef,
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
    (x, forcedTiers) => {
      if (!engineRef.current) return;

      const y = -200;
      const banana = createBananaBody({
        x,
        y,
        tiers: forcedTiers ?? unlockedTiersRef.current,
        giantChance: giantChanceRef.current,
        viewportWidth: window.innerWidth,
        baseUrl: import.meta.env.BASE_URL,
      });
      Matter.Composite.add(engineRef.current.world, banana);
    },
    [giantChanceRef, unlockedTiersRef],
  );

  const spawnCoin = useCallback((x) => {
    if (!engineRef.current) return;
    const coin = createCoinBody({
      x,
      y: -100,
      viewportWidth: window.innerWidth,
      baseUrl: import.meta.env.BASE_URL,
    });
    Matter.Composite.add(engineRef.current.world, coin);
  }, []);

  const spawnSpecialBanana = useCallback(
    (x, item) => {
      if (!engineRef.current) return;
      const body = createSpecialBananaBody({
        x,
        y: -200,
        item,
        giantChance: giantChanceRef.current,
        viewportWidth: window.innerWidth,
        baseUrl: import.meta.env.BASE_URL,
      });
      Matter.Composite.add(engineRef.current.world, body);
    },
    [giantChanceRef],
  );

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

    // ドラッグ中のバナナは他のバナナ・UIとの衝突を無視する
    // (バナナを持っているときはそっちを優先)
    // また、HTML UI要素がマウスイベントを奪わないよう pointer-events を無効化
    const savedFilters = new WeakMap();
    Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
      const body = event.body;
      if (
        body &&
        (body.label === 'banana' ||
          body.label === 'special_banana' ||
          body.label === 'coin')
      ) {
        savedFilters.set(body, {
          category: body.collisionFilter.category,
          mask: body.collisionFilter.mask,
          group: body.collisionFilter.group,
        });
        // 独自カテゴリに移行: 同グループ内で衝突しない
        body.collisionFilter.group = -1;
        // HTML UI要素のpointer-eventsを無効化してドラッグを途切れさせない
        document.body.classList.add('banana-dragging');
      }
    });
    Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
      const body = event.body;
      if (body && savedFilters.has(body)) {
        const saved = savedFilters.get(body);
        body.collisionFilter.category = saved.category;
        body.collisionFilter.mask = saved.mask;
        body.collisionFilter.group = saved.group;
        savedFilters.delete(body);
      }
      // pointer-events を復元
      document.body.classList.remove('banana-dragging');
    });

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
      // ツリーパネル（幅160px + 左24px = 約200px）との重なりを回避するため、やや右寄りに配置
      const textX = w * 0.55;
      textCtx.fillText('BANANA', textX, h / 2);
      textCtx.globalCompositeOperation = 'destination-in';
      textCtx.drawImage(bananaCapture, 0, 0);
      textCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(textWork, 0, 0);

      // デバッグ: 当たり判定のポリゴン輪郭を描画
      if (devModeRef && devModeRef.current) {
        const allBodies = Matter.Composite.allBodies(engine.world);
        ctx.lineWidth = 2;
        for (const body of allBodies) {
          ctx.strokeStyle = body.isStatic
            ? 'rgba(0, 128, 255, 0.8)'
            : 'rgba(255, 0, 0, 0.8)';
          for (const part of body.parts) {
            const verts = part.vertices;
            if (!verts || verts.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(verts[0].x, verts[0].y);
            for (let k = 1; k < verts.length; k++) {
              ctx.lineTo(verts[k].x, verts[k].y);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
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

      // ブラックホール引力：半径350px以内のバナナを引き寄せる
      const allBodies = Composite.allBodies(engine.world);
      const blackholes = allBodies.filter(
        (b) =>
          b.label === 'special_banana' && b.shopItemId === 'banana_blackhole',
      );
      if (blackholes.length > 0) {
        const bananas = allBodies.filter((b) => b.label === 'banana');
        blackholes.forEach((bh) => {
          bananas.forEach((banana) => {
            if (banana.isStatic) return;
            const dx = bh.position.x - banana.position.x;
            const dy = bh.position.y - banana.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 350 && dist > 5) {
              // 重力の約2.5倍の引力（dist=200 基準）
              const forceMag = (0.5 * banana.mass) / Math.max(dist, 30);
              Matter.Body.applyForce(banana, banana.position, {
                x: (dx / dist) * forceMag,
                y: (dy / dist) * forceMag,
              });
            }
          });
        });
      }
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

      // バナコイン：画面下に落ちたら収集、横に出たら消去
      const coins = bodies.filter((b) => b.label === 'coin');
      coins.forEach((coin) => {
        if (coin.position.y > h + 100) {
          Composite.remove(engine.world, coin);
          onCoinRef.current?.(coin.position.x);
        } else if (coin.position.x < -200 || coin.position.x > w + 200) {
          Composite.remove(engine.world, coin);
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

  return { spawnBanana, spawnSpecialBanana, spawnCoin };
}

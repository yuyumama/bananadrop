import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

const BananaWorld = ({ bananaPerClick = 1, autoSpawnRate = 0, gravityScale = 1, bounceMultiplier = 1, unlockedTiers = [], onScore }) => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const bananaPerClickRef = useRef(bananaPerClick);
    const onScoreRef = useRef(onScore);
    const bounceMulRef = useRef(bounceMultiplier);
    const unlockedTiersRef = useRef(unlockedTiers);

    useEffect(() => { bananaPerClickRef.current = bananaPerClick }, [bananaPerClick]);
    useEffect(() => { onScoreRef.current = onScore }, [onScore]);
    useEffect(() => { bounceMulRef.current = bounceMultiplier }, [bounceMultiplier]);
    useEffect(() => { unlockedTiersRef.current = unlockedTiers }, [unlockedTiers]);

    useEffect(() => {
        if (!engineRef.current) return;
        engineRef.current.gravity.y = gravityScale;
    }, [gravityScale]);

    const spawnBanana = useCallback((x) => {
        if (!engineRef.current) return;

        const y = -100;
        const scale = window.innerWidth / 3000;

        const vertices = [
            { x: 0, y: 0 },
            { x: 200 * scale, y: -80 * scale },
            { x: 400 * scale, y: 0 },
            { x: 320 * scale, y: 120 * scale },
            { x: 80 * scale, y: 120 * scale }
        ];

        const tiers = unlockedTiersRef.current;
        const tier = tiers[Math.floor(Math.random() * tiers.length)];
        const baseUrl = import.meta.env.BASE_URL;

        const banana = Matter.Bodies.fromVertices(x, y, [vertices], {
            render: {
                sprite: {
                    texture: `${baseUrl}${tier.texture}`,
                    xScale: 0.8 * scale,
                    yScale: 0.8 * scale
                }
            },
            restitution: Math.min(0.9, 0.5 * bounceMulRef.current),
            friction: 0.1,
            density: 0.001
        });
        banana.label = 'banana';
        banana.bananaScore = tier.score;

        Matter.Body.setPosition(banana, { x, y });
        Matter.Composite.add(engineRef.current.world, banana);
    }, []);

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
                background: 'transparent'
            }
        });

        const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Offscreen canvases for BANANA text reveal effect
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

            // BANANAテキストリビール（バナナの場所のみ表示）
            captureCtx.clearRect(0, 0, w, h);
            captureCtx.drawImage(render.canvas, 0, 0);

            textCtx.clearRect(0, 0, w, h);
            textCtx.globalCompositeOperation = 'source-over';
            textCtx.font = `900 ${w * 0.18}px sans-serif`;
            textCtx.fillStyle = 'rgba(0, 0, 0, 0.95)';
            textCtx.textAlign = 'center';
            textCtx.textBaseline = 'middle';
            textCtx.fillText('BANANA', w / 2, h / 2);
            textCtx.globalCompositeOperation = 'destination-in';
            textCtx.drawImage(bananaCapture, 0, 0);
            textCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(textWork, 0, 0);
        });

        // 画面外バナナを検出 → スコアアイテムとして通知
        Matter.Events.on(engine, 'afterUpdate', () => {
            const bodies = Composite.allBodies(engine.world);
            const fallen = bodies.filter(b => b.label === 'banana' && b.position.y > window.innerHeight + 200);
            if (fallen.length > 0) {
                const scoreItems = fallen.map(b => ({ score: b.bananaScore || 1, x: b.position.x }));
                fallen.forEach(b => Composite.remove(engine.world, b));
                onScoreRef.current?.(scoreItems);
            }
        });

        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            bananaCapture.width = window.innerWidth;
            bananaCapture.height = window.innerHeight;
            textWork.width = window.innerWidth;
            textWork.height = window.innerHeight;

            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100).vertices);
            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
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
    }, []);

    useEffect(() => {
        if (autoSpawnRate <= 0) return;
        const interval = setInterval(() => {
            spawnBanana(Math.random() * window.innerWidth);
        }, 1000 / autoSpawnRate);
        return () => clearInterval(interval);
    }, [autoSpawnRate, spawnBanana]);

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
            ref={sceneRef}
            onClick={handleDataClick}
            onTouchStart={(e) => { handleDataClick(e); }}
            style={{ width: '100%', height: '100%', cursor: 'pointer', touchAction: 'none' }}
        />
    );
};

export default BananaWorld;

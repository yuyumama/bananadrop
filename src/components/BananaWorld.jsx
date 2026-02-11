import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const BananaWorld = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        // Create an engine
        const engine = Engine.create();
        engineRef.current = engine;

        // Create a renderer
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

        // Create ground and walls
        const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Run the renderer
        Render.run(render);

        // Create runner
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

            // 1. バナナが描画された現フレームをキャプチャ
            captureCtx.clearRect(0, 0, w, h);
            captureCtx.drawImage(render.canvas, 0, 0);

            // 2. BANANAテキストをオフスクリーンに描画
            textCtx.clearRect(0, 0, w, h);
            textCtx.globalCompositeOperation = 'source-over';
            textCtx.font = `900 ${w * 0.18}px sans-serif`;
            textCtx.fillStyle = 'rgba(0, 0, 0, 0.95)';
            textCtx.textAlign = 'center';
            textCtx.textBaseline = 'middle';
            textCtx.fillText('BANANA', w / 2, h / 2);

            // 3. バナナの形でテキストをマスク（バナナがある部分だけ残す）
            textCtx.globalCompositeOperation = 'destination-in';
            textCtx.drawImage(bananaCapture, 0, 0);
            textCtx.globalCompositeOperation = 'source-over';

            // 4. マスク済みテキストをメインキャンバスに合成
            ctx.drawImage(textWork, 0, 0);
        });

        // Handle resize
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            bananaCapture.width = window.innerWidth;
            bananaCapture.height = window.innerHeight;
            textWork.width = window.innerWidth;
            textWork.height = window.innerHeight;

            // Reposition ground and walls
            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100).vertices);

            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
            // No need to move left wall
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
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

    const handleDataClick = (e) => {
        if (!engineRef.current) return;

        let x;
        // Check for touch event first
        if (e && e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
        }
        // Check for mouse event
        else if (e && e.clientX !== undefined) {
            x = e.clientX;
        }
        // Fallback or initial random
        else {
            x = Math.random() * window.innerWidth;
        }

        const y = -100; // Start above screen

        // Create a body from vertices for a more accurate shape
        // Vertices approximating a banana curve (convex hull)
        // Adjusted for larger size (approx 2.5x larger than original)
        const scale = window.innerWidth / 1200;

        const vertices = [
            { x: 0, y: 0 },
            { x: 200 * scale, y: -80 * scale },
            { x: 400 * scale, y: 0 },
            { x: 320 * scale, y: 120 * scale },
            { x: 80 * scale, y: 120 * scale }
        ];

        const baseUrl = import.meta.env.BASE_URL;
        const textures = [
            `${baseUrl}banana_rembg.png`,
            `${baseUrl}banana_green.png`,
            `${baseUrl}banana_ripe.png`
        ];
        const randomTexture = textures[Math.floor(Math.random() * textures.length)];

        const banana = Matter.Bodies.fromVertices(x, y, [vertices], {
            render: {
                sprite: {
                    texture: randomTexture,
                    xScale: 0.8 * scale,
                    yScale: 0.8 * scale
                }
            },
            restitution: 0.5,
            friction: 0.1,
            // Adjust density since they are bigger
            density: 0.001
        });

        Matter.Body.setPosition(banana, { x: x, y: y });

        Matter.Composite.add(engineRef.current.world, banana);
    };

    return (
        <div
            ref={sceneRef}
            onClick={handleDataClick}
            onTouchStart={(e) => {
                // Prevent default touch behavior (scrolling/zooming) if needed, 
                // but for now just spawning is fine. 
                // e.preventDefault() might block scrolling completely, use with caution.
                // e.preventDefault() might block scrolling completely, use with caution.
                handleDataClick(e);
            }}
            style={{ width: '100%', height: '100%', cursor: 'pointer', touchAction: 'none' }}
        />
    );
};

export default BananaWorld;

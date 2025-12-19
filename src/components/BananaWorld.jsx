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

        // Handle resize
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;

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

    const handleDataClick = () => {
        if (!engineRef.current) return;

        const x = Math.random() * window.innerWidth;
        const y = -100; // Start above screen

        // Create a body from vertices for a more accurate shape
        // Vertices approximating a banana curve (convex hull)
        // Adjusted for larger size (approx 2.5x larger than original)
        const vertices = [
            { x: 0, y: 0 },
            { x: 200, y: -80 },
            { x: 400, y: 0 },
            { x: 320, y: 120 },
            { x: 80, y: 120 }
        ];

        const textures = [
            '/banana_rembg.png',
            '/banana_green.png',
            '/banana_ripe.png'
        ];
        const randomTexture = textures[Math.floor(Math.random() * textures.length)];

        const banana = Matter.Bodies.fromVertices(x, y, [vertices], {
            render: {
                sprite: {
                    texture: randomTexture,
                    xScale: 0.8, // Increased size
                    yScale: 0.8
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
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        />
    );
};

export default BananaWorld;

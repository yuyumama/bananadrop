import Matter from 'matter-js';

export const createBananaBody = ({
  x,
  y,
  tiers,
  giantChance,
  viewportWidth,
  baseUrl,
}) => {
  const isGiant = Math.random() < giantChance;
  const baseScale = Math.min(viewportWidth, 430) / 3000;
  const scale = isGiant ? baseScale * 3 : baseScale;

  const vertices = [
    { x: 0 * scale, y: 0 * scale },
    { x: 180 * scale, y: -85 * scale },
    { x: 400 * scale, y: -105 * scale },
    { x: 620 * scale, y: -68 * scale },
    { x: 740 * scale, y: 10 * scale },
    { x: 590 * scale, y: 75 * scale },
    { x: 370 * scale, y: 92 * scale },
    { x: 145 * scale, y: 55 * scale },
  ];

  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  const tex = tier.textures[Math.floor(Math.random() * tier.textures.length)];
  const texScale = (2048 / tex.size) * 0.5 * scale;

  const banana = Matter.Bodies.fromVertices(x, y, [vertices], {
    render: {
      sprite: {
        texture: `${baseUrl}${tex.file}`,
        xScale: texScale,
        yScale: texScale,
      },
    },
    restitution: 0.0,
    friction: 1.0,
    frictionStatic: 10.0,
    frictionAir: 0.02,
    density: isGiant ? 0.3 : 0.001,
  });

  banana.label = 'banana';
  banana.bananaScore = tier.score * (isGiant ? 50 : 1);
  banana.isGiant = isGiant;

  Matter.Body.setPosition(banana, { x, y });
  Matter.Body.setAngle(banana, Math.random() * Math.PI * 2);

  return banana;
};

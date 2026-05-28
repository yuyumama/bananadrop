export const collectBananaOutcome = ({
  bananas,
  screenWidth,
  screenHeight,
}) => {
  const fadeZone = screenWidth * 0.1;
  const scoredBodies = [];
  const lostBodies = [];
  const scoreItems = [];

  for (const b of bananas) {
    if (b.position.x < -200 || b.position.x > screenWidth + 200) {
      lostBodies.push(b);
      continue;
    }

    if (b.position.y > screenHeight + 200) {
      scoredBodies.push(b);
      const x = b.position.x;
      const distFromEdge = Math.min(x, screenWidth - x);
      const fraction = Math.min(1, distFromEdge / fadeZone);
      const finalScore = Math.round((b.bananaScore || 1) * fraction);

      if (finalScore > 0) {
        scoreItems.push({
          score: finalScore,
          tier: b.bananaTier ?? 1,
          x: Math.max(40, Math.min(screenWidth - 40, x)),
        });
      }
    }
  }

  return {
    scoreItems,
    scoredBodies,
    lostBodies,
  };
};

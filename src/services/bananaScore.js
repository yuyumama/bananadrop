export const collectBananaOutcome = ({
  bananas,
  screenWidth,
  screenHeight,
}) => {
  const scoredBodies = bananas.filter((b) => b.position.y > screenHeight + 200);
  const lostBodies = bananas.filter(
    (b) => b.position.x < -200 || b.position.x > screenWidth + 200,
  );

  const fadeZone = screenWidth * 0.1;
  const scoreItems = [];

  scoredBodies.forEach((b) => {
    const x = b.position.x;
    const distFromEdge = Math.min(x, screenWidth - x);
    const fraction = Math.min(1, distFromEdge / fadeZone);
    const finalScore = Math.round((b.bananaScore || 1) * fraction);

    if (finalScore > 0) {
      scoreItems.push({
        score: finalScore,
        x: Math.max(40, Math.min(screenWidth - 40, x)),
      });
    }
  });

  return {
    scoreItems,
    scoredBodies,
    lostBodies,
  };
};

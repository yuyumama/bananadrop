// ツリースキル（chosenSkills）から各種ボーナスを集計する

const MAX_WATER_COST_DISCOUNT = 0.9;

const sumBy = (skills, key) =>
  skills.reduce((sum, s) => sum + (s[key] ?? 0), 0);

export function computeTreeSkillBonuses(chosenSkills) {
  const waterBoost = sumBy(chosenSkills, 'waterBoost');
  const waterCostDiscount = Math.min(
    sumBy(chosenSkills, 'waterCostDiscount'),
    MAX_WATER_COST_DISCOUNT,
  );
  const coinsPerLevelUp = 1 + sumBy(chosenSkills, 'coinsPerLevelUp');
  const mutationRateBonus = sumBy(chosenSkills, 'mutationRateBonus');
  const criticalClickChance = sumBy(chosenSkills, 'criticalClickChance');

  return {
    waterBoost,
    waterCostDiscount,
    coinsPerLevelUp,
    mutationRateBonus,
    criticalClickChance,
  };
}

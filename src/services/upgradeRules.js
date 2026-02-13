export function canPurchaseUpgrade({ upgrade, score, purchased }) {
  if (score < upgrade.cost) return false;
  if (purchased.has(upgrade.id)) return false;
  if (upgrade.requires && !purchased.has(upgrade.requires)) return false;
  return true;
}

export function applyUpgradeEffects({ upgrade, state, bananaTiers }) {
  const nextState = {
    purchased: new Set([...state.purchased, upgrade.id]),
    bananaPerClick: state.bananaPerClick,
    autoSpawnRate: state.autoSpawnRate,
    giantChance: state.giantChance,
    unlockedTiers: state.unlockedTiers,
  };

  if (upgrade.clickPer) {
    nextState.bananaPerClick = upgrade.clickPer;
  } else if (upgrade.autoPer) {
    nextState.autoSpawnRate = upgrade.autoPer;
  } else if (upgrade.giantChance) {
    nextState.giantChance = upgrade.giantChance;
  } else if (upgrade.tier) {
    const newTier = bananaTiers.find((tier) => tier.tier === upgrade.tier);
    if (newTier) {
      nextState.unlockedTiers = [...state.unlockedTiers, newTier];
    }
  }

  return nextState;
}

export function buildGroupUpgradeViewModel({
  group,
  upgrades,
  purchased,
  score,
}) {
  const items = upgrades.filter((upgrade) => upgrade.group === group.key);
  const purchasedItems = items.filter((upgrade) => purchased.has(upgrade.id));

  const currentLabel =
    purchasedItems.length > 0
      ? purchasedItems[purchasedItems.length - 1].label
      : group.defaultLabel;

  const nextItem = items.find(
    (upgrade) =>
      !purchased.has(upgrade.id) &&
      (!upgrade.requires || purchased.has(upgrade.requires)),
  );

  const affordable = Boolean(nextItem && score >= nextItem.cost);

  return {
    currentLabel,
    nextItem,
    affordable,
  };
}

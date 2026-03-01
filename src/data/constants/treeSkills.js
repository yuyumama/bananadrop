/**
 * ツリースキルのステージ別プール（各ステージ3択・2つ提示）
 * 木の画像が変わるタイミング（5レベルごと）に3択からランダムで2つ提示される。
 * 後半ステージほど強力な効果。
 *
 * 効果の種類:
 *   growthBonus       : 自動成長速度 +N/s（ベース1/sに加算）
 *   waterCostDiscount : 水やりコストをN%割引（0.25 = -25%）
 *   waterBoost        : 水やり効果 +N%（ベース20%に加算）
 *   coinsPerLevelUp   : レベルアップ時バナコイン追加獲得数
 *   coinScoreBonus    : バナコイン回収時に追加スコア
 */
export const TREE_SKILL_STAGES = [
  // Stage 1 - LV.5（芽吹き）
  [
    {
      id: 's1_growth',
      name: '若芽の息吹',
      description: '成長速度 +20%',
      icon: '🌱',
      growthBonus: 0.2,
    },
    {
      id: 's1_water_cost',
      name: '節水術',
      description: '水やりコスト -50%',
      icon: '💧',
      waterCostDiscount: 0.5,
    },
    {
      id: 's1_water_boost',
      name: '豊かな土',
      description: '水やり効果 +10%',
      icon: '🪴',
      waterBoost: 0.1,
    },
    {
      id: 's1_mutation',
      name: '突然変異の種',
      description: '特殊バナナ出現率 +10%',
      icon: '🧬',
      mutationRateBonus: 0.1,
    },
  ],

  // Stage 2 - LV.10（若苗）
  [
    {
      id: 's2_growth',
      name: '大地の鼓動',
      description: '成長速度 +40%',
      icon: '🌿',
      growthBonus: 0.4,
    },
    {
      id: 's2_water_cost',
      name: '清らかな水',
      description: '水やりコスト -50%',
      icon: '💦',
      waterCostDiscount: 0.5,
    },
    {
      id: 's2_water_boost',
      name: '命の芽生え',
      description: '水やり効果 +10%',
      icon: '🌺',
      waterBoost: 0.1,
    },
    {
      id: 's2_critical',
      name: '会心の指先',
      description: 'タップ時 5%で大量生成',
      icon: '👆',
      criticalClickChance: 0.05,
    },
  ],

  // Stage 3 - LV.15（若葉）
  [
    {
      id: 's3_coins',
      name: '双子の実',
      description: 'レベルアップ時\nバナコイン +1',
      icon: '🍋',
      coinsPerLevelUp: 1,
    },
    {
      id: 's3_growth',
      name: '豊穣の根',
      description: '成長速度 +100%',
      icon: '🌳',
      growthBonus: 1.0,
    },
    {
      id: 's3_water_boost',
      name: '聖水の祝福',
      description: '水やり効果 +10%',
      icon: '✨',
      waterBoost: 0.1,
    },
    {
      id: 's3_mutation',
      name: '魔法の枝変わり',
      description: '特殊バナナ出現率 +30%',
      icon: '🔮',
      mutationRateBonus: 0.3,
    },
  ],

  // Stage 4 - LV.20（成長期）
  [
    {
      id: 's4_coins',
      name: '豊穣祈願',
      description: 'レベルアップ時\nバナコイン +2',
      icon: '🌻',
      coinsPerLevelUp: 2,
    },
    {
      id: 's4_growth',
      name: '神木の根',
      description: '成長速度 +150%',
      icon: '🌲',
      growthBonus: 1.5,
    },
    {
      id: 's4_water_cost',
      name: '奇跡の泉',
      description: '水やりコスト -80%',
      icon: '💎',
      waterCostDiscount: 0.8,
    },
    {
      id: 's4_critical',
      name: '豊穣の衝撃',
      description: 'タップ時 10%で大量生成',
      icon: '💥',
      criticalClickChance: 0.1,
    },
  ],

  // Stage 5 - LV.25（開花）
  [
    {
      id: 's5_coins',
      name: '天の恵み',
      description: 'レベルアップ時\nバナコイン +3',
      icon: '🌟',
      coinsPerLevelUp: 3,
    },
    {
      id: 's5_growth',
      name: '超加速成長',
      description: '成長速度 +200%',
      icon: '⚡',
      growthBonus: 2.0,
    },
    {
      id: 's5_water_boost',
      name: '生命の源',
      description: '水やり効果 +30%',
      icon: '💖',
      waterBoost: 0.3,
    },
    {
      id: 's5_mutation',
      name: '奇跡の遺伝子',
      description: '特殊バナナ出現率 +60%',
      icon: '🧬',
      mutationRateBonus: 0.6,
    },
  ],

  // Stage 6 - LV.30（成熟）
  [
    {
      id: 's6_coins',
      name: '奇跡の大樹',
      description: 'レベルアップ時\nバナコイン +5',
      icon: '🌈',
      coinsPerLevelUp: 5,
    },
    {
      id: 's6_growth',
      name: '光の根',
      description: '成長速度 +300%',
      icon: '💫',
      growthBonus: 3.0,
    },
    {
      id: 's6_water_cost',
      name: '究極の節水',
      description: '水やりコスト -80%',
      icon: '💧',
      waterCostDiscount: 0.8,
    },
    {
      id: 's6_critical',
      name: '神々の乱れ撃ち',
      description: 'タップ時 20%で大量生成',
      icon: '🎆',
      criticalClickChance: 0.2,
    },
  ],
];

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
  // Stage 1 - LV.5（芽吹き）─ 小さなユーティリティ
  [
    {
      id: 's1_growth',
      name: '若芽の息吹',
      description: '成長速度 +30%',
      icon: '🌱',
      growthBonus: 0.3,
    },
    {
      id: 's1_water_cost',
      name: '節水術',
      description: '水やりコスト -25%',
      icon: '💧',
      waterCostDiscount: 0.25,
    },
    {
      id: 's1_water_boost',
      name: '豊かな土',
      description: '水やり効果 +15%',
      icon: '🪴',
      waterBoost: 0.15,
    },
  ],

  // Stage 2 - LV.10（若苗）─ 初めてのユニーク効果
  [
    {
      id: 's2_coins',
      name: '双子の実',
      description: 'レベルアップ時\nバナコイン +1',
      icon: '🍋',
      coinsPerLevelUp: 1,
    },
    {
      id: 's2_growth',
      name: '大地の鼓動',
      description: '成長速度 +60%',
      icon: '🌿',
      growthBonus: 0.6,
    },
    {
      id: 's2_water_cost',
      name: '清らかな水',
      description: '水やりコスト -40%',
      icon: '💦',
      waterCostDiscount: 0.4,
    },
  ],

  // Stage 3 - LV.15（若葉）─ スコア連携が登場
  [
    {
      id: 's3_score',
      name: '黄金の蜜',
      description: 'コイン回収時\nスコア +300',
      icon: '🍯',
      coinScoreBonus: 300,
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
      description: '水やり効果 +25%',
      icon: '✨',
      waterBoost: 0.25,
    },
  ],

  // Stage 4 - LV.20（成長期）─ 本格的なボーナス
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
      description: '水やりコスト -60%',
      icon: '💎',
      waterCostDiscount: 0.6,
    },
  ],

  // Stage 5 - LV.25（開花）─ 大きなボーナス
  [
    {
      id: 's5_score',
      name: '神の実り',
      description: 'コイン回収時\nスコア +800',
      icon: '⭐',
      coinScoreBonus: 800,
    },
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
  ],

  // Stage 6 - LV.30（成熟）─ 究極ボーナス
  [
    {
      id: 's6_score',
      name: '永遠の実り',
      description: 'コイン回収時\nスコア +2000',
      icon: '👑',
      coinScoreBonus: 2000,
    },
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
  ],
];

import { BANANA_TIERS } from './constants/bananaTiers';

// クリック強化（~3x ずつ）
const CLICK_DATA = [
  { cost: 25, clickPer: 2 },
  { cost: 75, clickPer: 3 },
  { cost: 225, clickPer: 4 },
  { cost: 675, clickPer: 5 },
  { cost: 2025, clickPer: 6 },
  { cost: 6075, clickPer: 7 },
  { cost: 18225, clickPer: 8 },
  { cost: 54675, clickPer: 9 },
  { cost: 164025, clickPer: 10 },
  { cost: 492075, clickPer: 11 },
  { cost: 1476225, clickPer: 12 },
  { cost: 4428675, clickPer: 13 },
  { cost: 13286025, clickPer: 14 },
  { cost: 39858075, clickPer: 15 },
];

// バナナ種解放
const BANANA_DATA = [
  { cost: 1000, tier: 2 }, // 完熟バナナ 5pt
  { cost: 4000, tier: 3 }, // 赤バナナ 15pt
  { cost: 15000, tier: 4 }, // 真っ黒バナナ 40pt
  { cost: 50000, tier: 5 }, // 傷んだバナナ 100pt
  { cost: 175000, tier: 6 }, // 銅バナナ 250pt
  { cost: 600000, tier: 7 }, // 銀バナナ 600pt
  { cost: 2000000, tier: 8 }, // 金バナナ 1200pt
  { cost: 7500000, tier: 9 }, // 氷バナナ 2500pt
  { cost: 30000000, tier: 10 }, // 桜バナナ 5000pt
  { cost: 125000000, tier: 11 }, // 溶岩バナナ 10000pt
  { cost: 500000000, tier: 12 }, // 伝説バナナ 20000pt
];

// オートスポーン（~1.5x ずつ、1〜100本/秒）
const AUTO_DATA = [
  { cost: 50, autoPer: 1 },
  { cost: 75, autoPer: 2 },
  { cost: 113, autoPer: 3 },
  { cost: 169, autoPer: 4 },
  { cost: 253, autoPer: 5 },
  { cost: 380, autoPer: 6 },
  { cost: 570, autoPer: 7 },
  { cost: 854, autoPer: 8 },
  { cost: 1281, autoPer: 9 },
  { cost: 1922, autoPer: 10 },
  { cost: 2883, autoPer: 11 },
  { cost: 4325, autoPer: 12 },
  { cost: 6487, autoPer: 13 },
  { cost: 9731, autoPer: 14 },
  { cost: 14596, autoPer: 15 },
  { cost: 21895, autoPer: 16 },
  { cost: 32842, autoPer: 17 },
  { cost: 49263, autoPer: 18 },
  { cost: 73895, autoPer: 19 },
  { cost: 110842, autoPer: 20 },
  { cost: 166263, autoPer: 21 },
  { cost: 249394, autoPer: 22 },
  { cost: 374091, autoPer: 23 },
  { cost: 561137, autoPer: 24 },
  { cost: 841706, autoPer: 25 },
  { cost: 1262558, autoPer: 26 },
  { cost: 1893838, autoPer: 27 },
  { cost: 2840756, autoPer: 28 },
  { cost: 4261135, autoPer: 29 },
  { cost: 6391702, autoPer: 30 },
  { cost: 9587553, autoPer: 31 },
  { cost: 14381329, autoPer: 32 },
  { cost: 21571994, autoPer: 33 },
  { cost: 32357991, autoPer: 34 },
  { cost: 48536987, autoPer: 35 },
  { cost: 72805480, autoPer: 36 },
  { cost: 109208220, autoPer: 37 },
  { cost: 163812331, autoPer: 38 },
  { cost: 245718496, autoPer: 39 },
  { cost: 368577744, autoPer: 40 },
  { cost: 552866616, autoPer: 41 },
  { cost: 829299924, autoPer: 42 },
  { cost: 1243949886, autoPer: 43 },
  { cost: 1865924829, autoPer: 44 },
  { cost: 2798887244, autoPer: 45 },
  { cost: 4198330866, autoPer: 46 },
  { cost: 6297496298, autoPer: 47 },
  { cost: 9446244448, autoPer: 48 },
  { cost: 14169366671, autoPer: 49 },
  { cost: 21254050007, autoPer: 50 },
  { cost: 31881075011, autoPer: 51 },
  { cost: 47821612516, autoPer: 52 },
  { cost: 71732418774, autoPer: 53 },
  { cost: 107598628161, autoPer: 54 },
  { cost: 161397942242, autoPer: 55 },
  { cost: 242096913363, autoPer: 56 },
  { cost: 363145370044, autoPer: 57 },
  { cost: 544718055066, autoPer: 58 },
  { cost: 817077082599, autoPer: 59 },
  { cost: 1225615623898, autoPer: 60 },
  { cost: 1838423435847, autoPer: 61 },
  { cost: 2757635153770, autoPer: 62 },
  { cost: 4136452730655, autoPer: 63 },
  { cost: 6204679095982, autoPer: 64 },
  { cost: 9307018643974, autoPer: 65 },
  { cost: 13960527965961, autoPer: 66 },
  { cost: 20940791948941, autoPer: 67 },
  { cost: 31411187923411, autoPer: 68 },
  { cost: 47116781885117, autoPer: 69 },
  { cost: 70675172827675, autoPer: 70 },
  { cost: 106012759241513, autoPer: 71 },
  { cost: 159019138862269, autoPer: 72 },
  { cost: 238528708293403, autoPer: 73 },
  { cost: 357793062440105, autoPer: 74 },
  { cost: 536689593660158, autoPer: 75 },
  { cost: 805034390490236, autoPer: 76 },
  { cost: 1207551585735355, autoPer: 77 },
  { cost: 1811327378603032, autoPer: 78 },
  { cost: 2716991067904548, autoPer: 79 },
  { cost: 4075486601856821, autoPer: 80 },
  { cost: 6113229902785231, autoPer: 81 },
];

// レアバナナ確率UP（0.1%ずつ、~1.8x ずつ、初期500）
const RARE_DATA = [
  { cost: 500, giantChance: 0.001 },
  { cost: 900, giantChance: 0.002 },
  { cost: 1620, giantChance: 0.003 },
  { cost: 2916, giantChance: 0.004 },
  { cost: 5249, giantChance: 0.005 },
  { cost: 9448, giantChance: 0.006 },
  { cost: 17006, giantChance: 0.007 },
  { cost: 30611, giantChance: 0.008 },
  { cost: 55100, giantChance: 0.009 },
  { cost: 99180, giantChance: 0.01 },
  { cost: 178523, giantChance: 0.011 },
  { cost: 321342, giantChance: 0.012 },
  { cost: 578416, giantChance: 0.013 },
  { cost: 1041148, giantChance: 0.014 },
  { cost: 1874067, giantChance: 0.015 },
  { cost: 3373320, giantChance: 0.016 },
  { cost: 6071977, giantChance: 0.017 },
  { cost: 10929558, giantChance: 0.018 },
  { cost: 19673204, giantChance: 0.019 },
  { cost: 35411767, giantChance: 0.02 },
  { cost: 63741181, giantChance: 0.021 },
  { cost: 114734126, giantChance: 0.022 },
  { cost: 206521427, giantChance: 0.023 },
  { cost: 371738568, giantChance: 0.024 },
  { cost: 669129423, giantChance: 0.025 },
];

function buildClickUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `click${i}`,
    label: `${item.clickPer}本/クリック`,
    group: 'click',
    requires: i === 0 ? null : `click${i - 1}`,
  }));
}

function buildAutoUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `auto${i}`,
    label: `${item.autoPer}本/秒`,
    group: 'auto',
    requires: i === 0 ? null : `auto${i - 1}`,
  }));
}

function buildRareUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `rare${i}`,
    label: `レア${(item.giantChance * 100).toFixed(1)}%`,
    group: 'rare',
    requires: i === 0 ? null : `rare${i - 1}`,
  }));
}

function buildBananaUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `banana${i}`,
    label: BANANA_TIERS.find((t) => t.tier === item.tier)?.name ?? '',
    group: 'banana',
    requires: i === 0 ? null : `banana${i - 1}`,
  }));
}

export const CLICK_UPGRADES = buildClickUpgrades(CLICK_DATA);
export const BANANA_UPGRADES = buildBananaUpgrades(BANANA_DATA);
export const AUTO_UPGRADES = buildAutoUpgrades(AUTO_DATA);
export const RARE_UPGRADES = buildRareUpgrades(RARE_DATA);

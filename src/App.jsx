import { useState, useCallback, useRef, useEffect } from 'react';
import BananaWorld from './components/BananaWorld';

const BANANA_TIERS = [
  { tier: 1, name: '普通バナナ', score: 1, texture: 'banana_green.png' },
  { tier: 2, name: '熟バナナ', score: 3, texture: 'banana_rembg.png' },
  { tier: 3, name: '完熟バナナ', score: 12, texture: 'banana_ripe.png' },
  { tier: 4, name: '銀バナナ', score: 30, texture: 'banana_silver.png' },
  { tier: 5, name: '金バナナ', score: 100, texture: 'banana_gold.png' },
  { tier: 6, name: '伝説バナナ', score: 500, texture: 'banana_legend.png' },
];

const TIER_COLORS = [
  '#888',
  '#c8a000',
  '#cd7f32',
  '#c0c0c0',
  '#ffd700',
  '#ff00ff',
];

const UPGRADES = [
  // クリック強化（~3x ずつ）
  {
    id: 'click2',
    label: '2本/クリック',
    cost: 25,
    group: 'click',
    requires: null,
    clickPer: 2,
  },
  {
    id: 'click3',
    label: '3本/クリック',
    cost: 75,
    group: 'click',
    requires: 'click2',
    clickPer: 3,
  },
  {
    id: 'click4',
    label: '4本/クリック',
    cost: 225,
    group: 'click',
    requires: 'click3',
    clickPer: 4,
  },
  {
    id: 'click5',
    label: '5本/クリック',
    cost: 675,
    group: 'click',
    requires: 'click4',
    clickPer: 5,
  },
  {
    id: 'click6',
    label: '6本/クリック',
    cost: 2000,
    group: 'click',
    requires: 'click5',
    clickPer: 6,
  },
  {
    id: 'click7',
    label: '7本/クリック',
    cost: 6000,
    group: 'click',
    requires: 'click6',
    clickPer: 7,
  },
  {
    id: 'click8',
    label: '8本/クリック',
    cost: 18000,
    group: 'click',
    requires: 'click7',
    clickPer: 8,
  },
  {
    id: 'click9',
    label: '9本/クリック',
    cost: 55000,
    group: 'click',
    requires: 'click8',
    clickPer: 9,
  },
  {
    id: 'click10',
    label: '10本/クリック',
    cost: 165000,
    group: 'click',
    requires: 'click9',
    clickPer: 10,
  },
  {
    id: 'click11',
    label: '11本/クリック',
    cost: 500000,
    group: 'click',
    requires: 'click10',
    clickPer: 11,
  },
  {
    id: 'click12',
    label: '12本/クリック',
    cost: 1500000,
    group: 'click',
    requires: 'click11',
    clickPer: 12,
  },
  {
    id: 'click13',
    label: '13本/クリック',
    cost: 4500000,
    group: 'click',
    requires: 'click12',
    clickPer: 13,
  },
  {
    id: 'click14',
    label: '14本/クリック',
    cost: 13500000,
    group: 'click',
    requires: 'click13',
    clickPer: 14,
  },
  {
    id: 'click15',
    label: '15本/クリック',
    cost: 40500000,
    group: 'click',
    requires: 'click14',
    clickPer: 15,
  },
  // バナナ種解放
  {
    id: 'tier2',
    label: '熟バナナ',
    cost: 500,
    group: 'banana',
    requires: null,
    tier: 2,
  },
  {
    id: 'tier3',
    label: '完熟バナナ',
    cost: 1500,
    group: 'banana',
    requires: 'tier2',
    tier: 3,
  },
  {
    id: 'tier4',
    label: '銀バナナ',
    cost: 8000,
    group: 'banana',
    requires: 'tier3',
    tier: 4,
  },
  {
    id: 'tier5',
    label: '金バナナ',
    cost: 50000,
    group: 'banana',
    requires: 'tier4',
    tier: 5,
  },
  {
    id: 'tier6',
    label: '伝説バナナ',
    cost: 300000,
    group: 'banana',
    requires: 'tier5',
    tier: 6,
  },
  // オートスポーン（~1.16x ずつ、1〜100本/秒）
  {
    id: 'auto1',
    label: '1本/秒',
    cost: 30,
    group: 'auto',
    requires: null,
    autoPer: 1,
  },
  {
    id: 'auto2',
    label: '2本/秒',
    cost: 35,
    group: 'auto',
    requires: 'auto1',
    autoPer: 2,
  },
  {
    id: 'auto3',
    label: '3本/秒',
    cost: 40,
    group: 'auto',
    requires: 'auto2',
    autoPer: 3,
  },
  {
    id: 'auto4',
    label: '4本/秒',
    cost: 47,
    group: 'auto',
    requires: 'auto3',
    autoPer: 4,
  },
  {
    id: 'auto5',
    label: '5本/秒',
    cost: 54,
    group: 'auto',
    requires: 'auto4',
    autoPer: 5,
  },
  {
    id: 'auto6',
    label: '6本/秒',
    cost: 63,
    group: 'auto',
    requires: 'auto5',
    autoPer: 6,
  },
  {
    id: 'auto7',
    label: '7本/秒',
    cost: 73,
    group: 'auto',
    requires: 'auto6',
    autoPer: 7,
  },
  {
    id: 'auto8',
    label: '8本/秒',
    cost: 85,
    group: 'auto',
    requires: 'auto7',
    autoPer: 8,
  },
  {
    id: 'auto9',
    label: '9本/秒',
    cost: 98,
    group: 'auto',
    requires: 'auto8',
    autoPer: 9,
  },
  {
    id: 'auto10',
    label: '10本/秒',
    cost: 114,
    group: 'auto',
    requires: 'auto9',
    autoPer: 10,
  },
  {
    id: 'auto11',
    label: '11本/秒',
    cost: 133,
    group: 'auto',
    requires: 'auto10',
    autoPer: 11,
  },
  {
    id: 'auto12',
    label: '12本/秒',
    cost: 154,
    group: 'auto',
    requires: 'auto11',
    autoPer: 12,
  },
  {
    id: 'auto13',
    label: '13本/秒',
    cost: 179,
    group: 'auto',
    requires: 'auto12',
    autoPer: 13,
  },
  {
    id: 'auto14',
    label: '14本/秒',
    cost: 208,
    group: 'auto',
    requires: 'auto13',
    autoPer: 14,
  },
  {
    id: 'auto15',
    label: '15本/秒',
    cost: 241,
    group: 'auto',
    requires: 'auto14',
    autoPer: 15,
  },
  {
    id: 'auto16',
    label: '16本/秒',
    cost: 279,
    group: 'auto',
    requires: 'auto15',
    autoPer: 16,
  },
  {
    id: 'auto17',
    label: '17本/秒',
    cost: 324,
    group: 'auto',
    requires: 'auto16',
    autoPer: 17,
  },
  {
    id: 'auto18',
    label: '18本/秒',
    cost: 376,
    group: 'auto',
    requires: 'auto17',
    autoPer: 18,
  },
  {
    id: 'auto19',
    label: '19本/秒',
    cost: 436,
    group: 'auto',
    requires: 'auto18',
    autoPer: 19,
  },
  {
    id: 'auto20',
    label: '20本/秒',
    cost: 506,
    group: 'auto',
    requires: 'auto19',
    autoPer: 20,
  },
  {
    id: 'auto21',
    label: '21本/秒',
    cost: 587,
    group: 'auto',
    requires: 'auto20',
    autoPer: 21,
  },
  {
    id: 'auto22',
    label: '22本/秒',
    cost: 681,
    group: 'auto',
    requires: 'auto21',
    autoPer: 22,
  },
  {
    id: 'auto23',
    label: '23本/秒',
    cost: 790,
    group: 'auto',
    requires: 'auto22',
    autoPer: 23,
  },
  {
    id: 'auto24',
    label: '24本/秒',
    cost: 916,
    group: 'auto',
    requires: 'auto23',
    autoPer: 24,
  },
  {
    id: 'auto25',
    label: '25本/秒',
    cost: 1063,
    group: 'auto',
    requires: 'auto24',
    autoPer: 25,
  },
  {
    id: 'auto26',
    label: '26本/秒',
    cost: 1233,
    group: 'auto',
    requires: 'auto25',
    autoPer: 26,
  },
  {
    id: 'auto27',
    label: '27本/秒',
    cost: 1430,
    group: 'auto',
    requires: 'auto26',
    autoPer: 27,
  },
  {
    id: 'auto28',
    label: '28本/秒',
    cost: 1659,
    group: 'auto',
    requires: 'auto27',
    autoPer: 28,
  },
  {
    id: 'auto29',
    label: '29本/秒',
    cost: 1924,
    group: 'auto',
    requires: 'auto28',
    autoPer: 29,
  },
  {
    id: 'auto30',
    label: '30本/秒',
    cost: 2232,
    group: 'auto',
    requires: 'auto29',
    autoPer: 30,
  },
  {
    id: 'auto31',
    label: '31本/秒',
    cost: 2589,
    group: 'auto',
    requires: 'auto30',
    autoPer: 31,
  },
  {
    id: 'auto32',
    label: '32本/秒',
    cost: 3003,
    group: 'auto',
    requires: 'auto31',
    autoPer: 32,
  },
  {
    id: 'auto33',
    label: '33本/秒',
    cost: 3484,
    group: 'auto',
    requires: 'auto32',
    autoPer: 33,
  },
  {
    id: 'auto34',
    label: '34本/秒',
    cost: 4041,
    group: 'auto',
    requires: 'auto33',
    autoPer: 34,
  },
  {
    id: 'auto35',
    label: '35本/秒',
    cost: 4688,
    group: 'auto',
    requires: 'auto34',
    autoPer: 35,
  },
  {
    id: 'auto36',
    label: '36本/秒',
    cost: 5438,
    group: 'auto',
    requires: 'auto35',
    autoPer: 36,
  },
  {
    id: 'auto37',
    label: '37本/秒',
    cost: 6308,
    group: 'auto',
    requires: 'auto36',
    autoPer: 37,
  },
  {
    id: 'auto38',
    label: '38本/秒',
    cost: 7317,
    group: 'auto',
    requires: 'auto37',
    autoPer: 38,
  },
  {
    id: 'auto39',
    label: '39本/秒',
    cost: 8488,
    group: 'auto',
    requires: 'auto38',
    autoPer: 39,
  },
  {
    id: 'auto40',
    label: '40本/秒',
    cost: 9846,
    group: 'auto',
    requires: 'auto39',
    autoPer: 40,
  },
  {
    id: 'auto41',
    label: '41本/秒',
    cost: 11421,
    group: 'auto',
    requires: 'auto40',
    autoPer: 41,
  },
  {
    id: 'auto42',
    label: '42本/秒',
    cost: 13248,
    group: 'auto',
    requires: 'auto41',
    autoPer: 42,
  },
  {
    id: 'auto43',
    label: '43本/秒',
    cost: 15368,
    group: 'auto',
    requires: 'auto42',
    autoPer: 43,
  },
  {
    id: 'auto44',
    label: '44本/秒',
    cost: 17827,
    group: 'auto',
    requires: 'auto43',
    autoPer: 44,
  },
  {
    id: 'auto45',
    label: '45本/秒',
    cost: 20679,
    group: 'auto',
    requires: 'auto44',
    autoPer: 45,
  },
  {
    id: 'auto46',
    label: '46本/秒',
    cost: 23987,
    group: 'auto',
    requires: 'auto45',
    autoPer: 46,
  },
  {
    id: 'auto47',
    label: '47本/秒',
    cost: 27825,
    group: 'auto',
    requires: 'auto46',
    autoPer: 47,
  },
  {
    id: 'auto48',
    label: '48本/秒',
    cost: 32277,
    group: 'auto',
    requires: 'auto47',
    autoPer: 48,
  },
  {
    id: 'auto49',
    label: '49本/秒',
    cost: 37441,
    group: 'auto',
    requires: 'auto48',
    autoPer: 49,
  },
  {
    id: 'auto50',
    label: '50本/秒',
    cost: 43432,
    group: 'auto',
    requires: 'auto49',
    autoPer: 50,
  },
  {
    id: 'auto51',
    label: '51本/秒',
    cost: 50381,
    group: 'auto',
    requires: 'auto50',
    autoPer: 51,
  },
  {
    id: 'auto52',
    label: '52本/秒',
    cost: 58442,
    group: 'auto',
    requires: 'auto51',
    autoPer: 52,
  },
  {
    id: 'auto53',
    label: '53本/秒',
    cost: 67793,
    group: 'auto',
    requires: 'auto52',
    autoPer: 53,
  },
  {
    id: 'auto54',
    label: '54本/秒',
    cost: 78639,
    group: 'auto',
    requires: 'auto53',
    autoPer: 54,
  },
  {
    id: 'auto55',
    label: '55本/秒',
    cost: 91221,
    group: 'auto',
    requires: 'auto54',
    autoPer: 55,
  },
  {
    id: 'auto56',
    label: '56本/秒',
    cost: 105817,
    group: 'auto',
    requires: 'auto55',
    autoPer: 56,
  },
  {
    id: 'auto57',
    label: '57本/秒',
    cost: 122748,
    group: 'auto',
    requires: 'auto56',
    autoPer: 57,
  },
  {
    id: 'auto58',
    label: '58本/秒',
    cost: 142387,
    group: 'auto',
    requires: 'auto57',
    autoPer: 58,
  },
  {
    id: 'auto59',
    label: '59本/秒',
    cost: 165169,
    group: 'auto',
    requires: 'auto58',
    autoPer: 59,
  },
  {
    id: 'auto60',
    label: '60本/秒',
    cost: 191596,
    group: 'auto',
    requires: 'auto59',
    autoPer: 60,
  },
  {
    id: 'auto61',
    label: '61本/秒',
    cost: 222251,
    group: 'auto',
    requires: 'auto60',
    autoPer: 61,
  },
  {
    id: 'auto62',
    label: '62本/秒',
    cost: 257811,
    group: 'auto',
    requires: 'auto61',
    autoPer: 62,
  },
  {
    id: 'auto63',
    label: '63本/秒',
    cost: 299061,
    group: 'auto',
    requires: 'auto62',
    autoPer: 63,
  },
  {
    id: 'auto64',
    label: '64本/秒',
    cost: 346910,
    group: 'auto',
    requires: 'auto63',
    autoPer: 64,
  },
  {
    id: 'auto65',
    label: '65本/秒',
    cost: 402416,
    group: 'auto',
    requires: 'auto64',
    autoPer: 65,
  },
  {
    id: 'auto66',
    label: '66本/秒',
    cost: 466803,
    group: 'auto',
    requires: 'auto65',
    autoPer: 66,
  },
  {
    id: 'auto67',
    label: '67本/秒',
    cost: 541492,
    group: 'auto',
    requires: 'auto66',
    autoPer: 67,
  },
  {
    id: 'auto68',
    label: '68本/秒',
    cost: 628131,
    group: 'auto',
    requires: 'auto67',
    autoPer: 68,
  },
  {
    id: 'auto69',
    label: '69本/秒',
    cost: 728632,
    group: 'auto',
    requires: 'auto68',
    autoPer: 69,
  },
  {
    id: 'auto70',
    label: '70本/秒',
    cost: 845213,
    group: 'auto',
    requires: 'auto69',
    autoPer: 70,
  },
  {
    id: 'auto71',
    label: '71本/秒',
    cost: 980447,
    group: 'auto',
    requires: 'auto70',
    autoPer: 71,
  },
  {
    id: 'auto72',
    label: '72本/秒',
    cost: 1137319,
    group: 'auto',
    requires: 'auto71',
    autoPer: 72,
  },
  {
    id: 'auto73',
    label: '73本/秒',
    cost: 1319290,
    group: 'auto',
    requires: 'auto72',
    autoPer: 73,
  },
  {
    id: 'auto74',
    label: '74本/秒',
    cost: 1530376,
    group: 'auto',
    requires: 'auto73',
    autoPer: 74,
  },
  {
    id: 'auto75',
    label: '75本/秒',
    cost: 1775236,
    group: 'auto',
    requires: 'auto74',
    autoPer: 75,
  },
  {
    id: 'auto76',
    label: '76本/秒',
    cost: 2059274,
    group: 'auto',
    requires: 'auto75',
    autoPer: 76,
  },
  {
    id: 'auto77',
    label: '77本/秒',
    cost: 2388758,
    group: 'auto',
    requires: 'auto76',
    autoPer: 77,
  },
  {
    id: 'auto78',
    label: '78本/秒',
    cost: 2770960,
    group: 'auto',
    requires: 'auto77',
    autoPer: 78,
  },
  {
    id: 'auto79',
    label: '79本/秒',
    cost: 3214314,
    group: 'auto',
    requires: 'auto78',
    autoPer: 79,
  },
  {
    id: 'auto80',
    label: '80本/秒',
    cost: 3728604,
    group: 'auto',
    requires: 'auto79',
    autoPer: 80,
  },
  {
    id: 'auto81',
    label: '81本/秒',
    cost: 4325181,
    group: 'auto',
    requires: 'auto80',
    autoPer: 81,
  },
  {
    id: 'auto82',
    label: '82本/秒',
    cost: 5017210,
    group: 'auto',
    requires: 'auto81',
    autoPer: 82,
  },
  {
    id: 'auto83',
    label: '83本/秒',
    cost: 5819963,
    group: 'auto',
    requires: 'auto82',
    autoPer: 83,
  },
  {
    id: 'auto84',
    label: '84本/秒',
    cost: 6751157,
    group: 'auto',
    requires: 'auto83',
    autoPer: 84,
  },
  {
    id: 'auto85',
    label: '85本/秒',
    cost: 7831342,
    group: 'auto',
    requires: 'auto84',
    autoPer: 85,
  },
  {
    id: 'auto86',
    label: '86本/秒',
    cost: 9084357,
    group: 'auto',
    requires: 'auto85',
    autoPer: 86,
  },
  {
    id: 'auto87',
    label: '87本/秒',
    cost: 10537854,
    group: 'auto',
    requires: 'auto86',
    autoPer: 87,
  },
  {
    id: 'auto88',
    label: '88本/秒',
    cost: 12223911,
    group: 'auto',
    requires: 'auto87',
    autoPer: 88,
  },
  {
    id: 'auto89',
    label: '89本/秒',
    cost: 14179737,
    group: 'auto',
    requires: 'auto88',
    autoPer: 89,
  },
  {
    id: 'auto90',
    label: '90本/秒',
    cost: 16448495,
    group: 'auto',
    requires: 'auto89',
    autoPer: 90,
  },
  {
    id: 'auto91',
    label: '91本/秒',
    cost: 19080254,
    group: 'auto',
    requires: 'auto90',
    autoPer: 91,
  },
  {
    id: 'auto92',
    label: '92本/秒',
    cost: 22133095,
    group: 'auto',
    requires: 'auto91',
    autoPer: 92,
  },
  {
    id: 'auto93',
    label: '93本/秒',
    cost: 25674390,
    group: 'auto',
    requires: 'auto92',
    autoPer: 93,
  },
  {
    id: 'auto94',
    label: '94本/秒',
    cost: 29782292,
    group: 'auto',
    requires: 'auto93',
    autoPer: 94,
  },
  {
    id: 'auto95',
    label: '95本/秒',
    cost: 34547459,
    group: 'auto',
    requires: 'auto94',
    autoPer: 95,
  },
  {
    id: 'auto96',
    label: '96本/秒',
    cost: 40075053,
    group: 'auto',
    requires: 'auto95',
    autoPer: 96,
  },
  {
    id: 'auto97',
    label: '97本/秒',
    cost: 46487061,
    group: 'auto',
    requires: 'auto96',
    autoPer: 97,
  },
  {
    id: 'auto98',
    label: '98本/秒',
    cost: 53924991,
    group: 'auto',
    requires: 'auto97',
    autoPer: 98,
  },
  {
    id: 'auto99',
    label: '99本/秒',
    cost: 62552990,
    group: 'auto',
    requires: 'auto98',
    autoPer: 99,
  },
  {
    id: 'auto100',
    label: '100本/秒',
    cost: 72561469,
    group: 'auto',
    requires: 'auto99',
    autoPer: 100,
  },
  // レアバナナ確率UP（0.1%ずつ、~1.65x ずつ、初期500）
  {
    id: 'rare1',
    label: 'レア0.1%',
    cost: 500,
    group: 'rare',
    requires: null,
    giantChance: 0.001,
  },
  {
    id: 'rare2',
    label: 'レア0.2%',
    cost: 820,
    group: 'rare',
    requires: 'rare1',
    giantChance: 0.002,
  },
  {
    id: 'rare3',
    label: 'レア0.3%',
    cost: 1360,
    group: 'rare',
    requires: 'rare2',
    giantChance: 0.003,
  },
  {
    id: 'rare4',
    label: 'レア0.4%',
    cost: 2250,
    group: 'rare',
    requires: 'rare3',
    giantChance: 0.004,
  },
  {
    id: 'rare5',
    label: 'レア0.5%',
    cost: 3700,
    group: 'rare',
    requires: 'rare4',
    giantChance: 0.005,
  },
  {
    id: 'rare6',
    label: 'レア0.6%',
    cost: 6100,
    group: 'rare',
    requires: 'rare5',
    giantChance: 0.006,
  },
  {
    id: 'rare7',
    label: 'レア0.7%',
    cost: 10000,
    group: 'rare',
    requires: 'rare6',
    giantChance: 0.007,
  },
  {
    id: 'rare8',
    label: 'レア0.8%',
    cost: 16500,
    group: 'rare',
    requires: 'rare7',
    giantChance: 0.008,
  },
  {
    id: 'rare9',
    label: 'レア0.9%',
    cost: 27000,
    group: 'rare',
    requires: 'rare8',
    giantChance: 0.009,
  },
  {
    id: 'rare10',
    label: 'レア1.0%',
    cost: 44500,
    group: 'rare',
    requires: 'rare9',
    giantChance: 0.01,
  },
  {
    id: 'rare11',
    label: 'レア1.1%',
    cost: 73500,
    group: 'rare',
    requires: 'rare10',
    giantChance: 0.011,
  },
  {
    id: 'rare12',
    label: 'レア1.2%',
    cost: 121000,
    group: 'rare',
    requires: 'rare11',
    giantChance: 0.012,
  },
  {
    id: 'rare13',
    label: 'レア1.3%',
    cost: 200000,
    group: 'rare',
    requires: 'rare12',
    giantChance: 0.013,
  },
  {
    id: 'rare14',
    label: 'レア1.4%',
    cost: 330000,
    group: 'rare',
    requires: 'rare13',
    giantChance: 0.014,
  },
  {
    id: 'rare15',
    label: 'レア1.5%',
    cost: 545000,
    group: 'rare',
    requires: 'rare14',
    giantChance: 0.015,
  },
  {
    id: 'rare16',
    label: 'レア1.6%',
    cost: 900000,
    group: 'rare',
    requires: 'rare15',
    giantChance: 0.016,
  },
  {
    id: 'rare17',
    label: 'レア1.7%',
    cost: 1480000,
    group: 'rare',
    requires: 'rare16',
    giantChance: 0.017,
  },
  {
    id: 'rare18',
    label: 'レア1.8%',
    cost: 2450000,
    group: 'rare',
    requires: 'rare17',
    giantChance: 0.018,
  },
  {
    id: 'rare19',
    label: 'レア1.9%',
    cost: 4040000,
    group: 'rare',
    requires: 'rare18',
    giantChance: 0.019,
  },
  {
    id: 'rare20',
    label: 'レア2.0%',
    cost: 6670000,
    group: 'rare',
    requires: 'rare19',
    giantChance: 0.02,
  },
  {
    id: 'rare21',
    label: 'レア2.1%',
    cost: 11000000,
    group: 'rare',
    requires: 'rare20',
    giantChance: 0.021,
  },
  {
    id: 'rare22',
    label: 'レア2.2%',
    cost: 18150000,
    group: 'rare',
    requires: 'rare21',
    giantChance: 0.022,
  },
  {
    id: 'rare23',
    label: 'レア2.3%',
    cost: 29950000,
    group: 'rare',
    requires: 'rare22',
    giantChance: 0.023,
  },
  {
    id: 'rare24',
    label: 'レア2.4%',
    cost: 49400000,
    group: 'rare',
    requires: 'rare23',
    giantChance: 0.024,
  },
  {
    id: 'rare25',
    label: 'レア2.5%',
    cost: 81500000,
    group: 'rare',
    requires: 'rare24',
    giantChance: 0.025,
  },
];

const GROUPS = [
  { key: 'click', label: '🍌 クリック', defaultLabel: '1本/クリック' },
  { key: 'banana', label: '🌟 バナナ種', defaultLabel: '普通バナナのみ' },
  { key: 'auto', label: '⏰ オート', defaultLabel: '手動のみ' },
  { key: 'rare', label: '💫 レア', defaultLabel: 'レアなし' },
];

let _textId = 0;

function App() {
  const [score, setScore] = useState(0);
  const [bananaPerClick, setBananaPerClick] = useState(1);
  const [autoSpawnRate, setAutoSpawnRate] = useState(0);
  const [giantChance, setGiantChance] = useState(0);
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]]);
  const [purchased, setPurchased] = useState(new Set());
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);

  const unlockedTiersRef = useRef(unlockedTiers);
  useEffect(() => {
    unlockedTiersRef.current = unlockedTiers;
  }, [unlockedTiers]);

  // 実測ローリング平均（5秒間の実スコア履歴から計算）
  const scoreHistoryRef = useRef([]);
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 5000;
      scoreHistoryRef.current = scoreHistoryRef.current.filter(
        (e) => e.time > cutoff,
      );
      const total = scoreHistoryRef.current.reduce((s, e) => s + e.score, 0);
      setPerSecond(Math.round(total / 5));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0);
    setScore((s) => s + total);
    scoreHistoryRef.current.push({ time: Date.now(), score: total });
    setScoreBump(true);
    setTimeout(() => setScoreBump(false), 300);

    const newTexts = scoreItems.map((item) => ({
      id: ++_textId,
      value: item.score,
      x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
    }));
    setFloatingTexts((prev) => [...prev, ...newTexts]);
    setTimeout(() => {
      const ids = new Set(newTexts.map((t) => t.id));
      setFloatingTexts((prev) => prev.filter((t) => !ids.has(t.id)));
    }, 1200);
  }, []);

  const handleClick = useCallback((e) => {
    const id = ++_textId;
    setClickEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setClickEffects((prev) => prev.filter((ef) => ef.id !== id)),
      600,
    );
  }, []);

  const buyUpgrade = (upgrade) => {
    if (score < upgrade.cost) return;
    if (purchased.has(upgrade.id)) return;
    if (upgrade.requires && !purchased.has(upgrade.requires)) return;

    setScore((s) => s - upgrade.cost);
    setPurchased((p) => new Set([...p, upgrade.id]));

    if (upgrade.clickPer) setBananaPerClick(upgrade.clickPer);
    else if (upgrade.autoPer) setAutoSpawnRate(upgrade.autoPer);
    else if (upgrade.giantChance) setGiantChance(upgrade.giantChance);
    else if (upgrade.tier) {
      const newTier = BANANA_TIERS.find((t) => t.tier === upgrade.tier);
      setUnlockedTiers((prev) => [...prev, newTier]);
    }
  };

  const scoreColor = (score) => {
    if (score >= 500) return '#ff00ff';
    if (score >= 100) return '#ffd700';
    if (score >= 30) return '#c0c0c0';
    if (score >= 12) return '#cd7f32';
    if (score >= 3) return '#c8a000';
    return '#555';
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      {/* スコア表示 */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 16,
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          animation: scoreBump ? 'scoreBump 0.3s ease-out' : 'none',
        }}
      >
        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>
          🍌 {score.toLocaleString()}
        </span>
        {perSecond > 0 && (
          <span style={{ fontSize: '0.72rem', color: '#888' }}>
            +{perSecond.toLocaleString()}/秒
          </span>
        )}
      </div>

      {/* 解放中のバナナ種 */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          gap: 4,
        }}
      >
        {unlockedTiers.map((t) => (
          <div
            key={t.tier}
            style={{
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 10,
              padding: '5px 9px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              color: TIER_COLORS[t.tier - 1],
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              userSelect: 'none',
            }}
          >
            {t.name}
            <br />
            <span style={{ fontSize: '0.65rem' }}>+{t.score}pt</span>
          </div>
        ))}
      </div>

      {/* 浮き上がりテキスト */}
      {floatingTexts.map((t) => (
        <div
          key={t.id}
          style={{
            position: 'fixed',
            left: t.x,
            bottom: 100,
            zIndex: 20,
            fontSize:
              t.value >= 500
                ? '2.5rem'
                : t.value >= 100
                  ? '2.2rem'
                  : t.value >= 30
                    ? '1.8rem'
                    : t.value >= 12
                      ? '1.4rem'
                      : '1.1rem',
            fontWeight: 'bold',
            color: scoreColor(t.value),
            pointerEvents: 'none',
            animation: 'floatUp 1.2s ease-out forwards',
            textShadow: '0 1px 4px rgba(255,255,255,0.9)',
            whiteSpace: 'nowrap',
          }}
        >
          +{t.value}🍌
        </div>
      ))}

      {/* クリックリップル */}
      {clickEffects.map((ef) => (
        <div
          key={ef.id}
          style={{
            position: 'fixed',
            left: ef.x,
            top: ef.y,
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '3px solid rgba(255, 200, 0, 0.9)',
            pointerEvents: 'none',
            zIndex: 20,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}

      {/* アップグレードパネル */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.93)',
          borderTop: '1.5px solid rgba(0,0,0,0.08)',
          padding: '8px 8px 10px',
          display: 'flex',
          gap: 6,
          backdropFilter: 'blur(10px)',
        }}
      >
        {GROUPS.map((group) => {
          const items = UPGRADES.filter((u) => u.group === group.key);
          const purchasedItems = items.filter((u) => purchased.has(u.id));
          const currentLabel =
            purchasedItems.length > 0
              ? purchasedItems[purchasedItems.length - 1].label
              : group.defaultLabel;
          const nextItem = items.find(
            (u) =>
              !purchased.has(u.id) &&
              (!u.requires || purchased.has(u.requires)),
          );
          const affordable = nextItem && score >= nextItem.cost;

          return (
            <div
              key={group.key}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  color: '#888',
                  textAlign: 'center',
                }}
              >
                {group.label}
              </div>
              {!nextItem ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: '7px 4px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#b0e0a0',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#3a7a3a' }}>
                    ✓ {currentLabel}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6rem',
                      marginTop: 1,
                      fontWeight: 'normal',
                      color: '#5a9a5a',
                    }}
                  >
                    MAX
                  </div>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    buyUpgrade(nextItem);
                  }}
                  style={{
                    width: '100%',
                    padding: '7px 4px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: affordable ? 'pointer' : 'not-allowed',
                    background: affordable ? '#ffd700' : '#eeeeee',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: affordable
                      ? '0 2px 10px rgba(255,190,0,0.6), 0 0 0 1.5px rgba(255,180,0,0.4)'
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    transform: affordable ? 'translateY(-1px)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '0.6rem', color: '#666' }}>
                    {currentLabel}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#333' }}>
                    → {nextItem.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6rem',
                      marginTop: 1,
                      fontWeight: 'normal',
                      opacity: 0.8,
                    }}
                  >
                    🍌 {nextItem.cost.toLocaleString()}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <BananaWorld
        bananaPerClick={bananaPerClick}
        autoSpawnRate={autoSpawnRate}
        panelHeight={80}
        unlockedTiers={unlockedTiers}
        giantChance={giantChance}
        onScore={handleScore}
      />
    </div>
  );
}

export default App;

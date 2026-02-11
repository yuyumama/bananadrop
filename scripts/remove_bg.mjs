import { Jimp } from 'jimp';

// コーナーから色をサンプリングしてフラッドフィルで背景除去
async function removeBackground(
  inputPath,
  outputPath,
  tolerance = 40,
  erosionPasses = 0,
  erosionTol = 120,
) {
  const image = await Jimp.read(inputPath);
  const { width, height, data } = image.bitmap;

  // 左上コーナー 5x5 の平均色を背景色として取得
  let rSum = 0,
    gSum = 0,
    bSum = 0;
  for (let py = 0; py < 5; py++) {
    for (let px = 0; px < 5; px++) {
      const idx = (py * width + px) * 4;
      rSum += data[idx];
      gSum += data[idx + 1];
      bSum += data[idx + 2];
    }
  }
  const bgR = rSum / 25,
    bgG = gSum / 25,
    bgB = bSum / 25;
  console.log(
    `  背景色: rgb(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`,
  );

  // 全エッジピクセルからフラッドフィル
  const stack = [];
  for (let x = 0; x < width; x++) {
    stack.push(x);
    stack.push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    stack.push(y * width);
    stack.push(y * width + width - 1);
  }

  while (stack.length > 0) {
    const pos = stack.pop();
    if (pos < 0 || pos >= width * height || data[pos * 4 + 3] === 0) continue;

    const idx = pos * 4;
    const r = data[idx],
      g = data[idx + 1],
      b = data[idx + 2];
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
    if (dist > tolerance) continue;

    data[idx + 3] = 0;

    const x = pos % width;
    const y = Math.floor(pos / width);
    if (x > 0) stack.push(pos - 1);
    if (x < width - 1) stack.push(pos + 1);
    if (y > 0) stack.push(pos - width);
    if (y < height - 1) stack.push(pos + width);
  }

  // エロージョン: 透明ピクセルに隣接する背景/影ピクセルを追加で除去
  // 低彩度（グレー系）かつ背景色に近ければ影/背景と判断
  for (let pass = 0; pass < erosionPasses; pass++) {
    const toRemove = [];
    for (let pos = 0; pos < width * height; pos++) {
      if (data[pos * 4 + 3] === 0) continue;
      let hasTransparentNeighbor = false;
      for (const n of [pos - 1, pos + 1, pos - width, pos + width]) {
        if (n >= 0 && n < width * height && data[n * 4 + 3] === 0) {
          hasTransparentNeighbor = true;
          break;
        }
      }
      if (!hasTransparentNeighbor) continue;
      const idx = pos * 4;
      const r = data[idx],
        g = data[idx + 1],
        b = data[idx + 2];
      // 彩度チェック (max-min)/max で低ければグレー系 = 影か背景
      const maxC = Math.max(r, g, b),
        minC = Math.min(r, g, b);
      const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
      const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
      // 低彩度(< 0.25) で背景に近ければ除去
      if (saturation < 0.25 && dist < erosionTol) toRemove.push(pos);
    }
    for (const pos of toRemove) data[pos * 4 + 3] = 0;
    if (toRemove.length === 0) break;
    console.log(`  エロージョン pass ${pass + 1}: ${toRemove.length}px 除去`);
  }

  await image.write(outputPath);
  console.log(`  保存: ${outputPath}`);
}

const tasks = [
  {
    input: 'public/banana_gold_1770801156862.png',
    output: 'public/banana_gold.png',
    tolerance: 55,
    erosionPasses: 60,
    erosionTol: 200,
  },
  {
    input: 'public/banana_silver_1770801168898.png',
    output: 'public/banana_silver.png',
    tolerance: 70,
    erosionPasses: 8,
    erosionTol: 80,
  },
  {
    input: 'public/legend.jpg',
    output: 'public/banana_legend.png',
    tolerance: 55,
    erosionPasses: 25,
    erosionTol: 110,
  },
];

for (const { input, output, tolerance, erosionPasses, erosionTol } of tasks) {
  console.log(`処理中: ${input}`);
  await removeBackground(input, output, tolerance, erosionPasses, erosionTol);
}
console.log('完了!');

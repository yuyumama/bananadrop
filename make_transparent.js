import { Jimp } from 'jimp';

async function main() {
  const input = process.argv[2];
  const output = process.argv[3];

  console.log(`Reading ${input}...`);
  const image = await Jimp.read(input);

  console.log('Processing...');
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // If nearly white
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
      }
    },
  );

  console.log(`Writing to ${output}...`);
  await image.write(output);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

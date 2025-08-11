/*
  Generates Android and Windows tile icons from the 4K transparent cropped logo.
*/
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generateIcons() {
  const input = path.resolve('public/Asset/BELUGALOGOAUGUSTV1.png');
  const outDir = path.resolve('public/Asset');
  await ensureDir(outDir);

  // Trim transparent/near-empty borders so the logo fills more of the icon area
  const trimmedBuffer = await sharp(input)
    .ensureAlpha()
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const sizes = [192, 256, 384, 512];
  const background = { r: 0, g: 0, b: 0, alpha: 0 };

  for (const size of sizes) {
    const output = path.join(outDir, `android-chrome-${size}x${size}.png`);
    await sharp(trimmedBuffer)
      .ensureAlpha()
      .resize({ width: size, height: size, fit: 'contain', background })
      .png()
      .toFile(output);
    console.log('Wrote', output);
  }

  const mstile = path.join(outDir, 'mstile-150x150.png');
  await sharp(trimmedBuffer)
    .ensureAlpha()
    .resize({ width: 150, height: 150, fit: 'contain', background })
    .png()
    .toFile(mstile);
  console.log('Wrote', mstile);

  // Apple Touch Icon
  const appleTouch = path.join(outDir, 'apple-touch-icon.png');
  await sharp(trimmedBuffer)
    .ensureAlpha()
    .resize({ width: 180, height: 180, fit: 'contain', background })
    .png()
    .toFile(appleTouch);
  console.log('Wrote', appleTouch);

  // PNG Favicons
  const favicon16 = path.join(outDir, 'favicon-16x16.png');
  await sharp(trimmedBuffer)
    .ensureAlpha()
    .resize({ width: 16, height: 16, fit: 'contain', background })
    .png()
    .toFile(favicon16);
  console.log('Wrote', favicon16);

  const favicon32 = path.join(outDir, 'favicon-32x32.png');
  await sharp(trimmedBuffer)
    .ensureAlpha()
    .resize({ width: 32, height: 32, fit: 'contain', background })
    .png()
    .toFile(favicon32);
  console.log('Wrote', favicon32);
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});



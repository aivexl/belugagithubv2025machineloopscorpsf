/*
  Generates multi-resolution favicon.ico from the 4K transparent cropped logo.
*/
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generateIco() {
  // Prefer beluganewlogo.png; support both /Asset and root public
  const candidateInputs = [
    path.resolve('public/Asset/beluganewlogov2.png'),
    path.resolve('public/beluganewlogov2.png'),
    path.resolve('public/Asset/beluganewlogo.png'),
    path.resolve('public/beluganewlogo.png'),
    // legacy fallback
    path.resolve('public/Asset/BELUGALOGOAUGUSTV1.png'),
  ];
  let input = null;
  for (const p of candidateInputs) {
    if (fs.existsSync(p)) { input = p; break; }
  }
  if (!input) {
    throw new Error('beluganewlogo.png not found in public/Asset or public/. Please add it first.');
  }

  const outDir = path.resolve('public/Asset');
  const tmpDir = path.resolve('public/Asset/.tmp_fav');
  await ensureDir(outDir);
  await ensureDir(tmpDir);

  // Trim transparent/near-empty borders so the logo fills more of the icon area
  const trimmedBuffer = await sharp(input)
    .ensureAlpha()
    .trim({ threshold: 10 }) // remove surrounding transparent/near-transparent pixels
    .png()
    .toBuffer();

  const sizes = [16, 24, 32, 48, 64, 128, 256, 512];
  const background = { r: 0, g: 0, b: 0, alpha: 0 };
  const files = [];
  for (const size of sizes) {
    const out = path.join(tmpDir, `favicon-${size}.png`);
    await sharp(trimmedBuffer)
      .ensureAlpha()
      .resize({ width: size, height: size, fit: 'contain', background })
      .png()
      .toFile(out);
    files.push(out);
    console.log('Prepared', out);
  }

  const ico = await pngToIco(files);
  const icoPath = path.resolve('public/favicon.ico');
  fs.writeFileSync(icoPath, ico);
  console.log('Wrote', icoPath);
}

generateIco().catch((err) => {
  console.error(err);
  process.exit(1);
});



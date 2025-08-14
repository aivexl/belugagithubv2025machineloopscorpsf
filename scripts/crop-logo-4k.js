/*
  Creates a clean, tightly-cropped 4K PNG logo from beluganewlogo.png
  - Input candidates:
      public/Asset/beluganewlogo.png
      public/beluganewlogo.png
  - Output:
      public/Asset/beluganewlogo-4k-cropped.png (long side = 3840 px)
*/
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function main() {
  const candidates = [
    path.resolve('public/Asset/beluganewlogov2.png'),
    path.resolve('public/beluganewlogov2.png'),
    path.resolve('public/Asset/beluganewlogo.png'),
    path.resolve('public/beluganewlogo.png'),
  ];
  let input = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) { input = p; break; }
  }
  if (!input) {
    throw new Error('beluganewlogov2.png (or beluganewlogo.png) not found in public/Asset or public/. Please add it first.');
  }

  const outputDir = path.resolve('public/Asset');
  await fs.promises.mkdir(outputDir, { recursive: true });
  const useV2 = /beluganewlogov2\.png$/i.test(input);
  const output = path.join(outputDir, useV2 ? 'beluganewlogov2-4k-cropped.png' : 'beluganewlogo-4k-cropped.png');

  // Load source
  let img = sharp(input).ensureAlpha();

  // Trim surrounding pixels similar to the top-left corner (common for uniform backgrounds)
  // Increase threshold if background is near-black or slightly off.
  const trimmed = await img.trim({ threshold: 10 }).toBuffer();

  // Determine orientation to set long side to 3840
  const meta = await sharp(trimmed).metadata();
  const longSide = Math.max(meta.width || 0, meta.height || 0) || 1;
  const scale = 3840 / longSide; // target long side
  const targetW = Math.round((meta.width || 1) * scale);
  const targetH = Math.round((meta.height || 1) * scale);

  await sharp(trimmed)
    .resize({ width: targetW, height: targetH })
    .png()
    .toFile(output);

  console.log('Wrote', output);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



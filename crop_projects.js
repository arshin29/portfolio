const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  const input = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794394525838_53108017.jpg';
  const img = sharp(input);
  const meta = await img.metadata();
  console.log('Metadata:', meta.width, 'x', meta.height);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = info.channels;

  function isBg(x, y) {
    const idx = (y * w + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return (r > 230 && g > 230 && b > 230 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15);
  }

  // 1. Fraganote: search in top-left (x: 20..500, y: 20..300)
  let fMinX = w, fMaxX = 0, fMinY = h, fMaxY = 0;
  for (let y = 20; y < 300; y++) {
    for (let x = 20; x < 500; x++) {
      if (!isBg(x, y)) {
        if (x < fMinX) fMinX = x;
        if (x > fMaxX) fMaxX = x;
        if (y < fMinY) fMinY = y;
        if (y > fMaxY) fMaxY = y;
      }
    }
  }

  // 2. Chime: search in top-right (x: 512..1000, y: 20..300)
  let cMinX = w, cMaxX = 0, cMinY = h, cMaxY = 0;
  for (let y = 20; y < 300; y++) {
    for (let x = 512; x < 1000; x++) {
      if (!isBg(x, y)) {
        if (x < cMinX) cMinX = x;
        if (x > cMaxX) cMaxX = x;
        if (y < cMinY) cMinY = y;
        if (y > cMaxY) cMaxY = y;
      }
    }
  }

  // 3. Blinkit: search in bottom (x: 100..920, y: 280..560)
  let bMinX = w, bMaxX = 0, bMinY = h, bMaxY = 0;
  for (let y = 280; y < 560; y++) {
    for (let x = 100; x < 920; x++) {
      if (!isBg(x, y)) {
        if (x < bMinX) bMinX = x;
        if (x > bMaxX) bMaxX = x;
        if (y < bMinY) bMinY = y;
        if (y > bMaxY) bMaxY = y;
      }
    }
  }

  console.log('Fraganote:', { fMinX, fMaxX, fMinY, fMaxY, width: fMaxX - fMinX, height: fMaxY - fMinY });
  console.log('Chime:', { cMinX, cMaxX, cMinY, cMaxY, width: cMaxX - cMinX, height: cMaxY - cMinY });
  console.log('Blinkit:', { bMinX, bMaxX, bMinY, bMaxY, width: bMaxX - bMinX, height: bMaxY - bMinY });

  // Crop and save
  // We can add a slight 1-2px inset to avoid any shadow edge
  await sharp(input)
    .extract({ left: fMinX + 2, top: fMinY + 2, width: fMaxX - fMinX - 4, height: fMaxY - fMinY - 4 })
    .jpeg({ quality: 95 })
    .toFile('public/projects/fraganote.jpg');
  console.log('Saved public/projects/fraganote.jpg');

  await sharp(input)
    .extract({ left: cMinX + 2, top: cMinY + 2, width: cMaxX - cMinX - 4, height: cMaxY - cMinY - 4 })
    .jpeg({ quality: 95 })
    .toFile('public/projects/chime.jpg');
  console.log('Saved public/projects/chime.jpg');

  await sharp(input)
    .extract({ left: bMinX + 2, top: bMinY + 2, width: bMaxX - bMinX - 4, height: bMaxY - bMinY - 4 })
    .jpeg({ quality: 95 })
    .toFile('public/projects/blinkit.jpg');
  console.log('Saved public/projects/blinkit.jpg');
}

processImages().catch(console.error);

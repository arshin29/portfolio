const sharp = require('sharp');

async function fixBlinkit() {
  const input = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794394525838_53108017.jpg';
  const img = sharp(input);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = info.channels;

  function isBg(x, y) {
    const idx = (y * w + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return (r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);
  }

  // Blinkit starts below Y=300
  let minX = 1000, maxX = 0, minY = 1000, maxY = 0;
  for (let y = 300; y < 550; y++) {
    for (let x = 180; x < 840; x++) {
      if (!isBg(x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Blinkit accurate bounds: X from', minX, 'to', maxX, '(w=' + (maxX - minX) + '), Y from', minY, 'to', maxY, '(h=' + (maxY - minY) + ')');

  await sharp(input)
    .extract({ left: minX, top: minY, width: maxX - minX, height: maxY - minY })
    .jpeg({ quality: 95 })
    .toFile('public/projects/blinkit.jpg');

  console.log('Blinkit re-saved cleanly!');
}

fixBlinkit().catch(console.error);

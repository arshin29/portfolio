const sharp = require('sharp');

async function testFeathered() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // Let's test a natural aspect ratio of 16:10 or 16:9
  // If we take the clean banner (height = 236px)
  // What if we test an aspect ratio where height is 340px or 380px?
  // Let's test cropping top from y=120 to y=460 (height = 340px)
  
  const dImg = sharp(dPath);
  const { data: dData, info: dInfo } = await dImg.raw().toBuffer({ resolveWithObject: true });
  
  // Smooth the horizontal border seam around y=166..174 with a 12px cosine/hermite fade
  for (let x = 0; x < dInfo.width; x++) {
    const yTop = 162;
    const yBot = 176;
    const topIdx = (yTop * dInfo.width + x) * dInfo.channels;
    const botIdx = (yBot * dInfo.width + x) * dInfo.channels;
    for (let y = yTop + 1; y < yBot; y++) {
      // Hermite smoothstep
      const norm = (y - yTop) / (yBot - yTop);
      const t = norm * norm * (3 - 2 * norm);
      const currIdx = (y * dInfo.width + x) * dInfo.channels;
      dData[currIdx] = Math.round(dData[topIdx] * (1 - t) + dData[botIdx] * t);
      dData[currIdx + 1] = Math.round(dData[topIdx + 1] * (1 - t) + dData[botIdx + 1] * t);
      dData[currIdx + 2] = Math.round(dData[topIdx + 2] * (1 - t) + dData[botIdx + 2] * t);
    }
  }

  // Also smooth bottom seam around y=405..412
  for (let x = 0; x < dInfo.width; x++) {
    const yTop = 404;
    const yBot = 412;
    const topIdx = (yTop * dInfo.width + x) * dInfo.channels;
    const botIdx = (yBot * dInfo.width + x) * dInfo.channels;
    for (let y = yTop + 1; y < yBot; y++) {
      const norm = (y - yTop) / (yBot - yTop);
      const t = norm * norm * (3 - 2 * norm);
      const currIdx = (y * dInfo.width + x) * dInfo.channels;
      dData[currIdx] = Math.round(dData[topIdx] * (1 - t) + dData[botIdx] * t);
      dData[currIdx + 1] = Math.round(dData[topIdx + 1] * (1 - t) + dData[botIdx + 1] * t);
      dData[currIdx + 2] = Math.round(dData[topIdx + 2] * (1 - t) + dData[botIdx + 2] * t);
    }
  }

  // Clean left rounded corner
  for (let y = 160; y <= 185; y++) {
    for (let x = 0; x <= 18; x++) {
      const idx = (y * dInfo.width + x) * dInfo.channels;
      if (dData[idx] < 60 && dData[idx+1] < 60 && dData[idx+2] < 60) {
        const refIdx = (y * dInfo.width + 20) * dInfo.channels;
        dData[idx] = dData[refIdx];
        dData[idx + 1] = dData[refIdx + 1];
        dData[idx + 2] = dData[refIdx + 2];
      }
    }
  }

  // Crop smoothly from y=80 to y=500 (height = 420px, width = 1024)
  // Aspect ratio = 1024 / 420 = 2.43 : 1
  await sharp(dData, { raw: dInfo })
    .extract({ left: 0, top: 80, width: 1024, height: 420 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile('scratch/documind_feathered.jpg');

  // TripNext
  const tImg = sharp(tPath);
  const { data: tData, info: tInfo } = await tImg.raw().toBuffer({ resolveWithObject: true });
  for (let x = 0; x < tInfo.width; x++) {
    const yTop = 160;
    const yBot = 174;
    const topIdx = (yTop * tInfo.width + x) * tInfo.channels;
    const botIdx = (yBot * tInfo.width + x) * tInfo.channels;
    for (let y = yTop + 1; y < yBot; y++) {
      const norm = (y - yTop) / (yBot - yTop);
      const t = norm * norm * (3 - 2 * norm);
      const currIdx = (y * tInfo.width + x) * tInfo.channels;
      tData[currIdx] = Math.round(tData[topIdx] * (1 - t) + tData[botIdx] * t);
      tData[currIdx + 1] = Math.round(tData[topIdx + 1] * (1 - t) + tData[botIdx + 1] * t);
      tData[currIdx + 2] = Math.round(tData[topIdx + 2] * (1 - t) + tData[botIdx + 2] * t);
    }
  }

  // Also smooth bottom seam around y=404..414
  for (let x = 0; x < tInfo.width; x++) {
    const yTop = 404;
    const yBot = 414;
    const topIdx = (yTop * tInfo.width + x) * tInfo.channels;
    const botIdx = (yBot * tInfo.width + x) * tInfo.channels;
    for (let y = yTop + 1; y < yBot; y++) {
      const norm = (y - yTop) / (yBot - yTop);
      const t = norm * norm * (3 - 2 * norm);
      const currIdx = (y * tInfo.width + x) * tInfo.channels;
      tData[currIdx] = Math.round(tData[topIdx] * (1 - t) + tData[botIdx] * t);
      tData[currIdx + 1] = Math.round(tData[topIdx + 1] * (1 - t) + tData[botIdx + 1] * t);
      tData[currIdx + 2] = Math.round(tData[topIdx + 2] * (1 - t) + tData[botIdx + 2] * t);
    }
  }

  await sharp(tData, { raw: tInfo })
    .extract({ left: 0, top: 80, width: 1024, height: 420 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile('scratch/tripnext_feathered.jpg');

  console.log('Saved feathered images');
}
testFeathered();

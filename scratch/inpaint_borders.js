const sharp = require('sharp');

async function removeBorderLine() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  const dImg = sharp(dPath);
  const { data: dData, info: dInfo } = await dImg.raw().toBuffer({ resolveWithObject: true });

  // Inpaint DocuMind around y=167..173:
  // For each column x, interpolate smoothly between y=165 and y=175
  for (let x = 0; x < dInfo.width; x++) {
    const topIdx = (165 * dInfo.width + x) * dInfo.channels;
    const botIdx = (175 * dInfo.width + x) * dInfo.channels;
    for (let y = 166; y <= 174; y++) {
      const t = (y - 165) / (175 - 165);
      const currIdx = (y * dInfo.width + x) * dInfo.channels;
      dData[currIdx] = Math.round(dData[topIdx] * (1 - t) + dData[botIdx] * t);
      dData[currIdx + 1] = Math.round(dData[topIdx + 1] * (1 - t) + dData[botIdx + 1] * t);
      dData[currIdx + 2] = Math.round(dData[topIdx + 2] * (1 - t) + dData[botIdx + 2] * t);
    }
  }

  // Also inpaint left rounded corner at x=0..15, y=165..190 if dark
  for (let y = 165; y <= 190; y++) {
    for (let x = 0; x <= 16; x++) {
      const idx = (y * dInfo.width + x) * dInfo.channels;
      if (dData[idx] < 60 && dData[idx+1] < 60 && dData[idx+2] < 60) {
        // Sample from x=18
        const refIdx = (y * dInfo.width + 18) * dInfo.channels;
        dData[idx] = dData[refIdx];
        dData[idx + 1] = dData[refIdx + 1];
        dData[idx + 2] = dData[refIdx + 2];
      }
    }
  }

  await sharp(dData, { raw: dInfo })
    .toFile('scratch/documind_border_removed.png');

  // Do the same for TripNext around y=165..172
  const tImg = sharp(tPath);
  const { data: tData, info: tInfo } = await tImg.raw().toBuffer({ resolveWithObject: true });
  for (let x = 0; x < tInfo.width; x++) {
    const topIdx = (163 * tInfo.width + x) * tInfo.channels;
    const botIdx = (173 * tInfo.width + x) * tInfo.channels;
    for (let y = 164; y <= 172; y++) {
      const t = (y - 163) / (173 - 163);
      const currIdx = (y * tInfo.width + x) * tInfo.channels;
      tData[currIdx] = Math.round(tData[topIdx] * (1 - t) + tData[botIdx] * t);
      tData[currIdx + 1] = Math.round(tData[topIdx + 1] * (1 - t) + tData[botIdx + 1] * t);
      tData[currIdx + 2] = Math.round(tData[topIdx + 2] * (1 - t) + tData[botIdx + 2] * t);
    }
  }

  await sharp(tData, { raw: tInfo })
    .toFile('scratch/tripnext_border_removed.png');

  console.log('Saved border removed images');
}
removeBorderLine();

const sharp = require('sharp');

async function testDocuMindPositions() {
  const banner = sharp('public/projects/documind.jpg');
  const meta = await banner.metadata();
  
  // Container: 267 x 294 (desktop .pc-shot)
  // Scale factor = 294 / meta.height = 294 / 232 = 1.26724
  // Scaled width = meta.width * scale = 1008 * 1.26724 = 1277.38
  // Overflow = 1277.38 - 267 = 1010.38
  
  const positions = [68, 70, 72, 73, 74, 75, 76];
  for (const pos of positions) {
    const shift = (pos / 100) * 1010.38;
    const cropLeftInOrig = shift / 1.26724;
    const cropWidthInOrig = 267 / 1.26724; // 210.69
    
    await sharp('public/projects/documind.jpg')
      .extract({
        left: Math.max(0, Math.min(meta.width - Math.round(cropWidthInOrig), Math.round(cropLeftInOrig))),
        top: 0,
        width: Math.round(cropWidthInOrig),
        height: meta.height
      })
      .resize(267, 294)
      .toFile(`scratch/documind_pos_${pos}.png`);
  }
  console.log('Tested positions:', positions);
}
testDocuMindPositions();

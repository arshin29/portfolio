const sharp = require('sharp');

async function testCrops() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // Let's inspect the cropped banner: y=168 to y=408 (height = 240)
  await sharp(dPath)
    .extract({ left: 0, top: 168, width: 1024, height: 240 })
    .toFile('scratch/documind_crop_240.png');

  await sharp(tPath)
    .extract({ left: 0, top: 167, width: 1024, height: 241 })
    .toFile('scratch/tripnext_crop_240.png');

  console.log('Saved 240px crops');
}
testCrops();

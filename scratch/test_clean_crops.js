const sharp = require('sharp');

async function testCleanCrops() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // Crop DocuMind: inside the border
  // Let's test left: 16, top: 172, width: 1008, height: 234
  await sharp(dPath)
    .extract({ left: 14, top: 172, width: 1010, height: 234 })
    .toFile('scratch/documind_clean.png');

  // Crop TripNext: inside the border
  await sharp(tPath)
    .extract({ left: 14, top: 170, width: 1010, height: 236 })
    .toFile('scratch/tripnext_clean.png');

  console.log('Saved clean crops');
}
testCleanCrops();

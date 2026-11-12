const sharp = require('sharp');

async function testCleanDocuMind() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // Crop DocuMind with top: 174, left: 10, width: 1014, height: 232
  await sharp(dPath)
    .extract({ left: 10, top: 174, width: 1014, height: 232 })
    .toFile('scratch/documind_clean_v2.png');

  // Crop TripNext with top: 172, left: 10, width: 1014, height: 234
  await sharp(tPath)
    .extract({ left: 10, top: 172, width: 1014, height: 234 })
    .toFile('scratch/tripnext_clean_v2.png');

  console.log('Saved clean v2');
}
testCleanDocuMind();

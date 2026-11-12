const sharp = require('sharp');

async function createCleanCompositions() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';
  const tPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483184179_f552c39f.webp';

  // 1. Extract pure content banners
  // DocuMind pure banner: left: 16, top: 175, width: 1008, height: 232
  const dBanner = await sharp(dPath)
    .extract({ left: 16, top: 175, width: 1008, height: 232 })
    .toBuffer();

  // TripNext pure banner: left: 14, top: 170, width: 1010, height: 236
  const tBanner = await sharp(tPath)
    .extract({ left: 14, top: 170, width: 1010, height: 236 })
    .toBuffer();

  // Let's test two strategies:
  // Strategy A: The clean banner saved directly at high quality (e.g. 1024 wide)
  await sharp(dBanner).jpeg({ quality: 90 }).toFile('scratch/documind_banner_clean.jpg');
  await sharp(tBanner).jpeg({ quality: 90 }).toFile('scratch/tripnext_banner_clean.jpg');

  // Strategy B: Natural vertical atmospheric extension to 16:10 / 4:3 aspect ratio
  // For DocuMind: top is wall gradient, bottom is desk surface
  // Let's create an extended canvas (e.g. 1008 x 630, aspect ratio 1.6 : 1 = 16:10)
  // We can sample the top row and bottom row colors to extend naturally
  
  console.log('Saved baseline banners');
}
createCleanCompositions();

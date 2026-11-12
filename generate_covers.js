const sharp = require('sharp');

async function generateCoverImages() {
  const tripnextSource = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg';
  const documindSource = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg';

  // Target aspect ratio of postcard frame is ~0.91 (520 x 571)
  // 1. TripNext: extract left composition with TripNext badge and Kyoto exploration card
  await sharp(tripnextSource)
    .extract({ left: 0, top: 0, width: 520, height: 571 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/tripnext.jpg');
  console.log('Saved public/projects/tripnext.jpg');

  // 2. DocuMind: extract balanced composition centered on logo & floating badge
  await sharp(documindSource)
    .extract({ left: 25, top: 35, width: 475, height: 530 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/documind.jpg');
  console.log('Saved public/projects/documind.jpg');
}

generateCoverImages().catch(console.error);

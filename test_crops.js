const sharp = require('sharp');

async function testCrops() {
  const tripnext = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg';
  const documind = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg';

  // The target aspect ratio is 0.898 (e.g. 512 x 570)
  // Let's test a few crops for TripNext:
  // Crop 1: Left-weighted (x: 40, width: 512, y: 0, height: 571) - includes TripNext badge and Kyoto card
  await sharp(tripnext)
    .extract({ left: 40, top: 0, width: 512, height: 571 })
    .toFile('tripnext_crop1_left.jpg');

  // Crop 2: Center (x: 200, width: 512, y: 0, height: 571) - includes part of TripNext, Kyoto card, and map
  await sharp(tripnext)
    .extract({ left: 200, top: 0, width: 512, height: 571 })
    .toFile('tripnext_crop2_center.jpg');

  // Crop 3: Right-weighted (x: 400, width: 512, y: 0, height: 571) - focuses on Kyoto card, map, and flight cards
  await sharp(tripnext)
    .extract({ left: 450, top: 0, width: 512, height: 571 })
    .toFile('tripnext_crop3_right.jpg');

  // DocuMind crops:
  // Crop 1: Left-weighted (x: 0, width: 512, y: 0, height: 571) - includes DocuMind logo and main dashboard card
  await sharp(documind)
    .extract({ left: 40, top: 0, width: 512, height: 571 })
    .toFile('documind_crop1_left.jpg');

  // Crop 2: Center/Dashboard (x: 400, width: 512, y: 0, height: 571) - focuses on the rich web app dashboard
  await sharp(documind)
    .extract({ left: 420, top: 0, width: 512, height: 571 })
    .toFile('documind_crop2_dashboard.jpg');

  // Crop 3: Balanced (x: 220, width: 512, y: 0, height: 571)
  await sharp(documind)
    .extract({ left: 220, top: 0, width: 512, height: 571 })
    .toFile('documind_crop3_balanced.jpg');

  console.log('Test crops generated!');
}

testCrops().catch(console.error);

const sharp = require('sharp');

async function analyzeDocuMind() {
  const documind = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg';
  // Let's test a few crops:
  // Crop A: Left (0 to 520)
  await sharp(documind).extract({ left: 0, top: 0, width: 520, height: 571 }).toFile('documind_test_0_520.jpg');

  // Crop B: Starting around 30 to 550
  await sharp(documind).extract({ left: 30, top: 0, width: 520, height: 571 }).toFile('documind_test_30_550.jpg');

  // Crop C: Dashboard centered (380 to 900)
  await sharp(documind).extract({ left: 400, top: 0, width: 520, height: 571 }).toFile('documind_test_400_920.jpg');
}

analyzeDocuMind();

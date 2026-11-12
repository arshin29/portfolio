const sharp = require('sharp');

async function analyze() {
  const tripnextPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg';
  const documindPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg';

  const mTrip = await sharp(tripnextPath).metadata();
  const mDocu = await sharp(documindPath).metadata();

  console.log('TripNext:', mTrip.width, 'x', mTrip.height);
  console.log('DocuMind:', mDocu.width, 'x', mDocu.height);
}

analyze().catch(console.error);

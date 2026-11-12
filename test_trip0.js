const sharp = require('sharp');

async function testTrip0() {
  const tripnext = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg';
  // width: 512, height: 571, left: 0
  await sharp(tripnext)
    .extract({ left: 0, top: 0, width: 520, height: 571 })
    .toFile('tripnext_left0.jpg');
}

testTrip0();

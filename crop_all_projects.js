const sharp = require('sharp');

async function generateAllProjectImages() {
  const tripnextSrc = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg';
  const documindSrc = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg';
  const sideSrc = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794394525838_53108017.jpg';

  // 1. TripNext (Postcard Polaroid ~0.898 aperture)
  // Frosted logo card, 'Day 1 - Kyoto Exploration', avatars & planning tags
  await sharp(tripnextSrc)
    .extract({ left: 0, top: 0, width: 520, height: 571 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/tripnext.jpg');
  console.log('✓ TripNext cover generated');

  // 2. DocuMind (Postcard Polaroid ~0.898 aperture)
  // Vertically centered DocuMind glowing mark, title, tags, and floating PDF/DOCX badge
  await sharp(documindSrc)
    .extract({ left: 25, top: 35, width: 475, height: 530 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/documind.jpg');
  console.log('✓ DocuMind cover generated');

  // 3. Fraganote (Boarding Pass Ticket ~1.144 desktop, 1.333 mobile)
  // Centered perfume bottle on stone plinth with jasmine flower, 'Fraganote' label sharp
  await sharp(sideSrc)
    .extract({ left: 250, top: 37, width: 248, height: 251 })
    .resize(496, 502, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/fraganote.jpg');
  console.log('✓ Fraganote ticket thumbnail generated');

  // 4. Chime (Boarding Pass Ticket ~1.144 desktop, 1.333 mobile)
  // Smartphone chat UI with Alex avatar, active dot, 'Hey! 👋', 'Sounds good!', typing dots
  await sharp(sideSrc)
    .extract({ left: 775, top: 37, width: 208, height: 251 })
    .resize(416, 502, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/chime.jpg');
  console.log('✓ Chime ticket thumbnail generated');

  // 5. Blinkit (Boarding Pass Ticket ~1.144 desktop, 1.333 mobile)
  // Paper grocery bag with 'blinkit' logo, fresh vegetables, milk bottle, baguette
  await sharp(sideSrc)
    .extract({ left: 475, top: 309, width: 335, height: 235 })
    .resize(670, 470, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile('public/projects/blinkit.jpg');
  console.log('✓ Blinkit ticket thumbnail generated');
}

generateAllProjectImages().catch(console.error);

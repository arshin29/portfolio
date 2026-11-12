const sharp = require('sharp');

async function check(path, label) {
  const { dominant } = await sharp(path).stats();
  console.log(label, dominant);
}

async function main() {
  await check('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794422429380_c588207d.jpg', 'uploaded 1');
  await check('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794422442762_6db21952.jpg', 'uploaded 2');
  await check('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721177_9e30564f.jpg', 'documind orig?');
  await check('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794397721753_2942660c.jpg', 'tripnext orig?');
}
main().catch(console.error);

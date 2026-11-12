const sharp = require('sharp');
const fs = require('fs');
const dir = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/';
const files = fs.readdirSync(dir);

async function main() {
  for (const f of files) {
    const meta = await sharp(dir + f).metadata();
    console.log(f, meta.width, 'x', meta.height, (fs.statSync(dir + f).size / 1024).toFixed(1) + 'KB');
  }
}
main().catch(console.error);

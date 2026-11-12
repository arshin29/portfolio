const fs = require('fs');
const path = require('path');

const assets = [
  '/sky/contact-paper-texture.webp',
  '/sky/handwritten-rule.svg',
  '/sky/meadow-photographic-v2-optimized.webp'
];

async function checkAndDownload() {
  for (const a of assets) {
    const localPath = path.join('public', a);
    if (!fs.existsSync(localPath)) {
      console.log('Downloading', a, 'to', localPath);
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      try {
        const res = await fetch('https://thoufik.space' + a);
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(localPath, buffer);
          console.log('Downloaded', a, 'size:', buffer.length);
        } else {
          console.log('Failed to fetch', a, res.status);
        }
      } catch (err) {
        console.error('Error fetching', a, err.message);
      }
    } else {
      console.log('Already exists:', localPath, 'size:', fs.statSync(localPath).size);
    }
  }
}
checkAndDownload();

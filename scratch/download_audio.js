const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  '/sky/breeze-ambience.mp3',
  '/sky/birds-ambience.mp3',
  '/sky/night-ambience.mp3',
  '/sky/rain-ambience.mp3',
  '/sky/thunder-rumble.mp3',
  '/sky/fireworks/burst-01.mp3',
  '/sky/fireworks/burst-02.mp3',
  '/sky/fireworks/burst-03.mp3',
  '/sky/fireworks/burst-04.mp3',
  '/sky/fireworks/burst-05.mp3',
  '/sky/fireworks/burst-06.mp3'
];

function downloadFile(urlPath) {
  return new Promise((resolve, reject) => {
    const dest = path.join(__dirname, '..', 'public', urlPath.replace(/\//g, path.sep));
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    https.get('https://thoufik.space' + urlPath, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${urlPath}: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Downloaded:', urlPath, 'to', dest);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  for (const f of files) {
    try {
      await downloadFile(f);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('All audio assets downloaded successfully!');
}

downloadAll();

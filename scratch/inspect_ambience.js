const https = require('https');

function fetchScript(urlPath) {
  return new Promise((resolve, reject) => {
    https.get('https://thoufik.space' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function inspectAmbience() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  const idx = code.indexOf('-ambience.mp3');
  console.log('--- Ambient tracks code: ---');
  console.log(code.substring(idx - 600, idx + 1000));
}

inspectAmbience();

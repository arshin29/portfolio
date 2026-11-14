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

async function findSetWeatherTime() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  const idx = code.indexOf('breeze:');
  console.log('--- Context around breeze: ---');
  console.log(code.substring(idx - 400, idx + 800));
}

findSetWeatherTime();

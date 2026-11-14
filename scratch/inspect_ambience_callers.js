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

async function findAmbienceCallers() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  // Look for .setWeather or .setTime or Gg() usage
  const idx = code.indexOf('Gg()');
  console.log('--- Context around Gg(): ---');
  console.log(code.substring(idx - 200, idx + 800));
}

findAmbienceCallers();

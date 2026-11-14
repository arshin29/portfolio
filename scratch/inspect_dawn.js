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

async function findVolumeFormula() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  // Search for night, birds, breeze volume weights
  const idx = code.indexOf('.dawn');
  console.log('--- Context around .dawn: ---');
  console.log(code.substring(idx - 400, idx + 800));
}

findVolumeFormula();

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

async function findMore() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  const idx = code.indexOf('/sky/${r}-ambience.mp3');
  console.log('--- Context earlier: ---');
  console.log(code.substring(idx - 3500, idx - 1500));
}

findMore();

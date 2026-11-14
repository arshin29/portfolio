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

async function findReturnsOfGg() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  const idx = code.indexOf('function Gg()');
  // find return statement inside Gg
  const returnIdx = code.indexOf('return{', idx);
  console.log('--- return of Gg(): ---');
  console.log(code.substring(returnIdx, returnIdx + 1200));
}

findReturnsOfGg();

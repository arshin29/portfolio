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

async function findSetWeatherImpl() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');
  const returnIdx = code.indexOf('return{start:x,resume:S,isRunning:C,setRain:E,setWeather:T');
  console.log('--- Implementation before return: ---');
  console.log(code.substring(returnIdx - 1500, returnIdx));
}

findSetWeatherImpl();

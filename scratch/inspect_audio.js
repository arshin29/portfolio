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

async function search() {
  const scripts = [
    '/assets/main-ChS0KPh4.js',
    '/assets/content-DzYBZjOQ.js',
    '/assets/ambient-dynamics-Cdbg4ktG.js',
    '/assets/activity-C8nXz_SV.js',
    '/assets/style-gNzfksDR.js'
  ];

  for (const s of scripts) {
    console.log('Fetching', s);
    const code = await fetchScript(s);
    console.log(s, 'length:', code.length);

    // Look for audio / sound / mp3 / AudioContext / tone
    const audioKeywords = ['AudioContext', 'webkitAudioContext', '.mp3', '.ogg', '.wav', 'sound', 'audio', 'firework', 'ambient'];
    for (const kw of audioKeywords) {
      const idx = code.indexOf(kw);
      if (idx !== -1) {
        console.log(`Found "${kw}" in ${s} at index ${idx}:`);
        console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 200)));
        console.log('---');
      }
    }
  }
}

search();

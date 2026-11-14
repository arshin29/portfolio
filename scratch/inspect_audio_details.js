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

async function inspectAudioSystem() {
  const code = await fetchScript('/assets/main-ChS0KPh4.js');

  // Find all .mp3 or audio references
  const mp3Regex = /["'`][^"'`]*\.mp3[^"'`]*["'`]/g;
  const matches = code.match(mp3Regex);
  console.log('All MP3 references in main bundle:');
  console.log([...new Set(matches)]);

  // Find functions managing ambient audio / weather audio / time audio
  const idx = code.indexOf('/sky/fireworks/burst-');
  console.log('\n--- Code around fireworks audio: ---');
  console.log(code.substring(idx - 100, idx + 2500));
}

inspectAudioSystem();

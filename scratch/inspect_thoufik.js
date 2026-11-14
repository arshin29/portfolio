const https = require('https');

https.get('https://thoufik.space', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('HTML length:', data.length);
    const audioMatches = data.match(/[^"'`\s]+\.(?:mp3|ogg|wav|m4a|aac)[^"'`\s]*/gi);
    console.log('Audio files in HTML:', audioMatches);
    const jsMatches = data.match(/src=["']([^"']+\.js)["']/gi);
    console.log('Scripts:', jsMatches);
  });
}).on('error', err => {
  console.error(err);
});

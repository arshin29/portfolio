const fs = require('fs');

async function findThreeModule() {
  const r = await fetch('https://thoufik.space/');
  const html = await r.text();
  console.log('HTML matches for three:');
  const m = html.match(/assets\/[a-zA-Z0-9_\-]+\.js/g) || [];
  console.log('Found scripts:', m);

  // Also check inside postcard_chunk.js for any .js references
  const chunk = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');
  const chunkScripts = chunk.match(/assets\/[a-zA-Z0-9_\.\-]+\.js/g) || [];
  console.log('Chunk scripts:', [...new Set(chunkScripts)]);

  // Let's test downloading three.module
  for (const s of [...new Set(chunkScripts)]) {
    if (s.includes('three')) {
      const url = 'https://thoufik.space/' + s;
      console.log('Fetching', url);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        console.log('Fetched', s, 'length:', text.length);
        fs.writeFileSync('scratch/working_three.module.js', text);
      } else {
        console.log('Failed:', res.status);
      }
    }
  }
}
findThreeModule().catch(console.error);

const fs = require('fs');

async function findPostcardComponent() {
  const r = await fetch('https://thoufik.space/');
  const html = await r.text();
  const scriptMatches = html.match(/src="([^"]+\.js)"/g);
  console.log('Script matches:', scriptMatches);

  for (const m of scriptMatches) {
    const src = m.replace('src="', '').replace('"', '');
    const url = new URL(src, 'https://thoufik.space/').href;
    console.log('Fetching', url);
    const res = await fetch(url);
    const text = await res.text();
    if (text.includes('pc-frame') || text.includes('project-postcards')) {
      console.log('Found pc-frame in', url);
      fs.writeFileSync('scratch/postcard_chunk.js', text);
    }
  }
}
findPostcardComponent().catch(console.error);

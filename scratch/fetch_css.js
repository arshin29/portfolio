const fs = require('fs');

async function getCSS() {
  const r = await fetch('https://thoufik.space/');
  const html = await r.text();
  const cssMatches = html.match(/href="([^"]+\.css)"/g) || [];
  console.log('CSS matches:', cssMatches);
  let allCss = '';
  for (const m of cssMatches) {
    const href = m.replace('href="', '').replace('"', '');
    const url = new URL(href, 'https://thoufik.space/').href;
    console.log('Fetching', url);
    const res = await fetch(url);
    const text = await res.text();
    allCss += '\n/* ' + url + ' */\n' + text;
  }
  fs.writeFileSync('scratch/all-thoufik.css', allCss);
  console.log('Saved all CSS to scratch/all-thoufik.css, length:', allCss.length);
}
getCSS().catch(console.error);

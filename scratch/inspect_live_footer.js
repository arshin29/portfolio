const fs = require('fs');

async function inspectLiveFooter() {
  const res = await fetch('https://thoufik.space/');
  const html = await res.text();
  console.log('HTML contains meadow-socials?', html.includes('meadow-socials'));
  // print anything around meadow-connect or meadow-socials
  const idx = html.indexOf('meadow-connect');
  if (idx !== -1) {
    console.log(html.substring(idx - 200, idx + 800));
  } else {
    console.log('meadow-connect not found in initial SSR HTML, it is rendered in client js');
  }
}
inspectLiveFooter().catch(console.error);

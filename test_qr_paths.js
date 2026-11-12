const QRCode = require('qrcode');

const projects = [
  { id: 'fraganote', url: 'https://fraganote-shopify-hvfzocs3a-arshin-inc.vercel.app/' },
  { id: 'chime', url: 'https://chime-a2fi.vercel.app/' },
  { id: 'blinkit', url: 'https://blinkit-clone-six-green.vercel.app/' },
];

for (const p of projects) {
  const qr = QRCode.create(p.url, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const dark = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        dark.push([c, r]);
      }
    }
  }
  const pathD = dark.map(([x, y]) => `M${x + 2} ${y + 2}h1v1h-1z`).join('');
  const viewBox = `0 0 ${n + 4} ${n + 4}`;
  console.log(p.id, 'modules:', n, 'dark count:', dark.length, 'viewBox:', viewBox);
}

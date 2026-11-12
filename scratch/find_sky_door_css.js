const fs = require('fs');
const css = fs.readFileSync('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/scratch/all-thoufik.css', 'utf8');

const targets = [
  '.sky-door',
  '.sd-wrap',
  '.sd-glow',
  '.sky-door-btn',
  '.sky-pill',
  '.sd-label',
  '.sky-swap'
];

targets.forEach(t => {
  const regex = new RegExp(`[^{}]*\\${t}[^{}]*\\{[^}]+\\}`, 'g');
  let m;
  console.log('=== TARGET:', t);
  while ((m = regex.exec(css)) !== null) {
    console.log(m[0]);
  }
});

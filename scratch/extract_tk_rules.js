const fs = require('fs');
const css = fs.readFileSync('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/scratch/all-thoufik.css', 'utf8');

// Match everything related to .tk
const regex = /(?:^|\})([^{}]*\.tk[^{}]*\{[^}]+\})/g;
let m;
const rules = [];
while ((m = regex.exec(css)) !== null) {
  rules.push(m[1].trim());
}
console.log('Found', rules.length, 'rules');
fs.writeFileSync('scratch/exact_tk_rules.css', rules.join('\n'));

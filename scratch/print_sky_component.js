const fs = require('fs');
const code = fs.readFileSync('thoufik_style.js', 'utf8');

console.log(code.slice(500, 3500));

const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');
console.log('CSS length:', css.length);
// print first 2000 chars
console.log(css.slice(0, 2000));

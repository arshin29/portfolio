const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

console.log(css.slice(21500, 27000));

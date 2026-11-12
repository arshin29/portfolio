const fs = require('fs');
const css = fs.readFileSync('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/scratch/all-thoufik.css', 'utf8');

// Search for the section where .tk starts
const idx = css.indexOf('.tk{--mx:50;');
console.log('Index:', idx);
console.log(css.substring(idx, idx + 4500));

const fs = require('fs');
const css = fs.readFileSync('C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/scratch/all-thoufik.css', 'utf8');

const regex = /@keyframes sd-orbit[^{]*\{[^}]+\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
  console.log(m[0]);
}

const regex2 = /@property --sd-angle[^{]*\{[^}]+\}/g;
while ((m = regex2.exec(css)) !== null) {
  console.log(m[0]);
}

const fs = require('fs');
const skyCode = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');

const p = skyCode.indexOf('star');
console.log('star in sky-scene.js at:', p);
if (p !== -1) {
  console.log(skyCode.slice(p - 100, p + 500));
}

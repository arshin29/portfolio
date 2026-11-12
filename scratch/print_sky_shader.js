const fs = require('fs');
const skyCode = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');

const p = skyCode.indexOf('b=`');
console.log(skyCode.slice(p, p + 1200));

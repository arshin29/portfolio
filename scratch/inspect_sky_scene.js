const fs = require('fs');
const code = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');

console.log('--- sky-scene.js ---');
console.log(code.slice(0, 1500));
console.log('--- End of sky-scene.js ---');
console.log(code.slice(code.length - 1000));

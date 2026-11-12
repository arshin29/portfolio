const fs = require('fs');
const skyCode = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');

const firstLine = skyCode.split('\n')[0];
console.log('First line:', firstLine);

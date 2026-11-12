const fs = require('fs');
const skyCode = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');

let pos = 0;
while ((pos = skyCode.indexOf('`', pos)) !== -1) {
  const next = skyCode.indexOf('`', pos + 1);
  if (next !== -1) {
    const str = skyCode.slice(pos + 1, next);
    if (str.includes('void main') || str.includes('uniform') || str.includes('stars') || str.includes('gl_FragColor')) {
      console.log('Shader at', pos, 'length:', str.length);
      console.log(str.slice(0, 300));
      console.log('---');
    }
    pos = next + 1;
  } else {
    break;
  }
}

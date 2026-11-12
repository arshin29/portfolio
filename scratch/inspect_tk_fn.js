const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'pointerType===`touch`)return;let{clientX:i,clientY:a}=e;cancelAnimationFrame(n.current)';
const idx = code.indexOf(target);
console.log(code.substring(Math.max(0, idx - 400), idx));

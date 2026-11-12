const fs = require('fs');

let code = fs.readFileSync('scratch/assets/sky-scene.js', 'utf8');
code = code.replace('"./three.module-i9PMC45e.js"', '"./three.module.js"');
code = code.replace('"./ambient-dynamics-Cdbg4ktG.js"', '"./ambient-dynamics.js"');

fs.writeFileSync('src/components/meadow/skyScene.js', code);
console.log('Saved src/components/meadow/skyScene.js');

try {
  const mod = require('./src/components/meadow/skyScene.js');
  console.log('Loaded skyScene exports:', Object.keys(mod));
} catch (e) {
  console.error('Error loading skyScene:', e.message);
}

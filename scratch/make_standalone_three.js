const fs = require('fs');

let threeCode = fs.readFileSync('scratch/assets/three.module-i9PMC45e.js', 'utf8');

// Replace the import line: import{o as e}from"./jsx-runtime-CDwx85kJ.js";
threeCode = threeCode.replace(
  'import{o as e}from"./jsx-runtime-CDwx85kJ.js";',
  'var e=(fn,mod)=>()=>(mod||(fn((mod={exports:{}}).exports,mod),fn=null),mod.exports);'
);

fs.writeFileSync('scratch/standalone_three.js', threeCode);
console.log('Saved standalone_three.js, size:', threeCode.length);

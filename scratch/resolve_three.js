const fs = require('fs');
const s = fs.readFileSync('src/components/meadow/three.module.js', 'utf8');

const expMatch = s.match(/export\s*\{([^}]+)\}/);
const rawExports = expMatch[1].split(',').map(x => x.trim());

const map = {};
rawExports.forEach(item => {
  const parts = item.split(/\s+as\s+/);
  const internal = parts[0];
  const exported = parts[1] || parts[0];
  map[exported] = internal;
});

const namesFound = {};
for (const [exp, internal] of Object.entries(map)) {
  // Try to find what internal is
  // Look for prototype.is<Name>
  const isIdx = s.indexOf(internal + '.prototype.is');
  if (isIdx !== -1) {
    const sub = s.substring(isIdx + internal.length + 13, isIdx + internal.length + 50);
    const m = sub.match(/^[A-Za-z0-9_]+/);
    if (m) {
      namesFound[exp] = m[0];
      continue;
    }
  }

  // Look for `class <internal>`
  const classIdx = s.indexOf('class ' + internal);
  if (classIdx !== -1) {
    // Look backwards or forwards for comments or name
    const snippet = s.substring(classIdx, classIdx + 60).replace(/\n/g, ' ');
    namesFound[exp] = snippet;
    continue;
  }

  // Look for `const <internal>` or `var <internal>`
  const varIdx = s.indexOf('var ' + internal + '=');
  if (varIdx !== -1) {
    namesFound[exp] = s.substring(varIdx, varIdx + 60).replace(/\n/g, ' ');
    continue;
  }
}

fs.writeFileSync('scratch/three_symbol_map.json', JSON.stringify({ map, namesFound }, null, 2));
console.log('Saved three_symbol_map.json, resolved count:', Object.keys(namesFound).length);

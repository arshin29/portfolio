const fs = require('fs');

const css = fs.readFileSync('thoufik_main.css', 'utf8') + '\n' + fs.readFileSync('thoufik_style.css', 'utf8');

function findRules(keywords) {
  const lines = css.split('\n');
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    for (const kw of keywords) {
      if (lines[i].includes(kw)) {
        // Grab surrounding context
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length - 1, i + 8);
        results.push(`--- Keyword: ${kw} at line ${i} ---\n` + lines.slice(start, end).join('\n'));
        break;
      }
    }
  }
  return results;
}

console.log('=== SEARCHING CSS ===');
console.log('1. Rotating text / title:');
console.log(findRules(['rotating', 'ticker', 'word', 'subtitle', 'rotate-y', 'roll']).slice(0, 5).join('\n\n'));

console.log('2. Button / Talk:');
console.log(findRules(['talk', 'hero-btn', 'cta']).slice(0, 5).join('\n\n'));

console.log('3. Meadow / Grass / Canvas:');
console.log(findRules(['meadow', 'grass', 'garden', 'touch']).slice(0, 5).join('\n\n'));

console.log('4. Note / Paper / Contact:');
console.log(findRules(['note', 'tape', 'crease', 'contact']).slice(0, 5).join('\n\n'));

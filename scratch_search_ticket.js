const fs = require('fs');
const css = fs.readFileSync('thoufik_main.css', 'utf8');

function findCss(sel) {
  const re = new RegExp(`\\.${sel}[^{]*\\{[^}]+\\}`, 'g');
  const m = css.match(re);
  console.log(`=== Matches for .${sel} ===`, m ? m.length : 0);
  if (m) {
    m.slice(0, 10).forEach(rule => console.log(rule));
  }
}

findCss('tk-go');
findCss('tk-go-a');
findCss('tk-go-b');
findCss('tk-name');
findCss('tk-premise');
findCss('tk-formula');
findCss('tk-stub');
findCss('tk-photo');
findCss('tk-qr');
findCss('tk-bars');
findCss('tk-info');
findCss('tk-label');
findCss('project-tickets');
findCss('independent-projects');

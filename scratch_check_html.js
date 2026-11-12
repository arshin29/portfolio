fetch('http://localhost:3005')
  .then(r => r.text())
  .then(html => {
    const idx = html.indexOf('id="side-projects"');
    console.log(html.slice(idx, idx + 600));
  });

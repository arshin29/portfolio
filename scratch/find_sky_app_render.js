const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

let pos = 0;
while ((pos = code.indexOf('className:`sky-app', pos)) !== -1) {
  console.log('sky-app at', pos);
  console.log(code.slice(pos - 100, pos + 800));
  pos += 15;
}

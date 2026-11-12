const fs = require('fs');
const path = require('path');

const downloaded = new Set();

async function downloadAsset(relPath) {
  if (downloaded.has(relPath)) return;
  downloaded.add(relPath);

  const cleanName = path.basename(relPath);
  const localPath = path.join('scratch/assets', cleanName);
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const url = 'https://thoufik.space/' + relPath.replace(/^\//, '');
  console.log('Downloading', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log('Failed:', res.status, url);
      return;
    }
    const text = await res.text();
    fs.writeFileSync(localPath, text);
    console.log('Saved', cleanName, 'size:', text.length);

    // Look for imported relative paths
    const imports = text.match(/from\s*["'](\.\/[^"']+)["']/g) || [];
    for (const imp of imports) {
      const match = imp.match(/from\s*["']\.\/([^"']+)["']/);
      if (match) {
        const nextRel = 'assets/' + match[1];
        await downloadAsset(nextRel);
      }
    }

    // Also look for dynamic import("...")
    const dynamicImports = text.match(/import\(["'](\.\/[^"']+)["']\)/g) || [];
    for (const imp of dynamicImports) {
      const match = imp.match(/import\(["']\.\/([^"']+)["']\)/);
      if (match) {
        const nextRel = 'assets/' + match[1];
        await downloadAsset(nextRel);
      }
    }
  } catch (err) {
    console.error('Error downloading', relPath, err.message);
  }
}

async function run() {
  await downloadAsset('assets/three.module-i9PMC45e.js');
  await downloadAsset('assets/jsx-runtime-CDwx85kJ.js');
  await downloadAsset('assets/ambient-dynamics-Cdbg4ktG.js');
}
run();

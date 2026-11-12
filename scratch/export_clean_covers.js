const sharp = require('sharp');
const fs = require('fs');

async function exportOptimizedCovers() {
  // 1. DocuMind from border removed
  await sharp('scratch/documind_border_removed.png')
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/projects/documind.jpg');

  // 2. TripNext from border removed
  await sharp('scratch/tripnext_border_removed.png')
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/projects/tripnext.jpg');

  const dStat = fs.statSync('public/projects/documind.jpg');
  const tStat = fs.statSync('public/projects/tripnext.jpg');
  console.log('Optimized DocuMind size:', Math.round(dStat.size / 1024), 'KB');
  console.log('Optimized TripNext size:', Math.round(tStat.size / 1024), 'KB');
}
exportOptimizedCovers();

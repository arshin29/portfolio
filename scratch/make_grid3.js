const sharp = require('sharp');

async function makeGrid3() {
  const images = [
    { input: 'scratch/thoufik_logo_render.png', top: 20, left: 20 },
    { input: 'scratch/logo_v16.png', top: 20, left: 310 },
    { input: 'scratch/logo_v17.png', top: 310, left: 20 },
    { input: 'scratch/logo_v18.png', top: 310, left: 310 },
  ];

  await sharp({
    create: {
      width: 600,
      height: 600,
      channels: 4,
      background: { r: 10, g: 15, b: 25, alpha: 1 }
    }
  })
  .composite(images)
  .png()
  .toFile('scratch/logo_grid3.png');

  console.log('Grid 3 rendered');
}

makeGrid3();

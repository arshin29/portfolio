const sharp = require('sharp');

async function makeGrid2() {
  const images = [
    { input: 'scratch/thoufik_logo_render.png', top: 20, left: 20 },
    { input: 'scratch/logo_v10.png', top: 20, left: 310 },
    { input: 'scratch/logo_v11.png', top: 20, left: 600 },
    { input: 'scratch/logo_v12.png', top: 310, left: 20 },
    { input: 'scratch/logo_v14.png', top: 310, left: 310 },
  ];

  await sharp({
    create: {
      width: 890,
      height: 600,
      channels: 4,
      background: { r: 10, g: 15, b: 25, alpha: 1 }
    }
  })
  .composite(images)
  .png()
  .toFile('scratch/logo_grid2.png');

  console.log('Grid 2 rendered to scratch/logo_grid2.png');
}

makeGrid2();

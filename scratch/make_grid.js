const sharp = require('sharp');

// Create a 3x3 or 2x4 grid of images
async function makeGrid() {
  const images = [
    { input: 'scratch/thoufik_logo_render.png', top: 20, left: 20 },
    { input: 'scratch/logo_a3.png', top: 20, left: 310 },
    { input: 'scratch/logo_a4.png', top: 20, left: 600 },
    { input: 'scratch/logo_a6.png', top: 310, left: 20 },
    { input: 'scratch/logo_a7.png', top: 310, left: 310 },
    { input: 'scratch/logo_a8.png', top: 310, left: 600 },
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
  .toFile('scratch/logo_comparison_grid.png');

  console.log('Grid rendered to scratch/logo_comparison_grid.png');
}

makeGrid();

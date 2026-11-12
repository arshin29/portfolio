const sharp = require('sharp');

async function testFullHeight() {
  const dFull = sharp('scratch/documind_border_removed.png');
  const dMeta = await dFull.metadata();
  
  // Container: 267 x 294
  // If image is 1024 x 576:
  // Scale factor = 294 / 576 = 0.5104
  // Scaled width = 1024 * 0.5104 = 522.67
  // Visible width in original = 267 / 0.5104 = 523.1px!
  
  // Let's test at 80% horizontal position:
  const overflow = 522.67 - 267;
  const shift = 0.80 * overflow;
  const left = shift / 0.5104; // ~400px
  
  await sharp('scratch/documind_border_removed.png')
    .extract({
      left: Math.round(left),
      top: 0,
      width: Math.round(523.1),
      height: 576
    })
    .resize(267, 294)
    .toFile('scratch/sim_documind_full_height.png');

  // Also TripNext at 75%
  const tFull = sharp('scratch/tripnext_border_removed.png');
  const tLeft = (0.75 * 255.67) / 0.5104;
  await sharp('scratch/tripnext_border_removed.png')
    .extract({
      left: Math.round(tLeft),
      top: 0,
      width: Math.round(523.1),
      height: 576
    })
    .resize(267, 294)
    .toFile('scratch/sim_tripnext_full_height.png');

  console.log('Saved full height simulations');
}
testFullHeight();

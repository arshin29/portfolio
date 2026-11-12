const sharp = require('sharp');

async function simulate() {
  const dClean = sharp('scratch/documind_clean_v2.png');
  const tClean = sharp('scratch/tripnext_clean_v2.png');

  // Let's test container size: 400x400 (roughly desktop .pc-shot)
  // With object-fit: cover and different object-position
  
  // 1. DocuMind with right center (object-position: right / 85%)
  // Sharp can extract or resize with fit: 'cover', position: 'right' or position: 'center'
  
  // DocuMind at position 'right'
  await sharp('scratch/documind_clean_v2.png')
    .resize(400, 400, { fit: 'cover', position: 'right' })
    .toFile('scratch/sim_documind_right.png');

  // DocuMind at position '80%' (x = 808 - 200 = 608)
  const dMeta = await sharp('scratch/documind_clean_v2.png').metadata();
  // To simulate custom object-position like 75%:
  // In 400x400, height 232 is scaled to 400 (scale = 400/232 = 1.724)
  // visible width in original coordinates = 400 / 1.724 = 232px!
  // If we take a 232x232 square from the original:
  // At 75%: left = (dMeta.width - 232) * 0.75 = (1014 - 232) * 0.75 = 586.5
  await sharp('scratch/documind_clean_v2.png')
    .extract({ left: Math.round(586), top: 0, width: 232, height: 232 })
    .resize(400, 400)
    .toFile('scratch/sim_documind_75pct.png');

  // At 90%: left = (1014 - 232) * 0.90 = 703
  await sharp('scratch/documind_clean_v2.png')
    .extract({ left: Math.round(703), top: 0, width: 232, height: 232 })
    .resize(400, 400)
    .toFile('scratch/sim_documind_90pct.png');

  // TripNext at 70%:
  const tMeta = await sharp('scratch/tripnext_clean_v2.png').metadata();
  const tScale = 400 / tMeta.height;
  const tVisibleW = 400 / tScale; // 234px
  // At 70%: left = (1014 - 234) * 0.70 = 546
  await sharp('scratch/tripnext_clean_v2.png')
    .extract({ left: Math.round(546), top: 0, width: 234, height: 234 })
    .resize(400, 400)
    .toFile('scratch/sim_tripnext_70pct.png');

  // TripNext at 85%:
  await sharp('scratch/tripnext_clean_v2.png')
    .extract({ left: Math.round((1014 - 234) * 0.85), top: 0, width: 234, height: 234 })
    .resize(400, 400)
    .toFile('scratch/sim_tripnext_85pct.png');

  console.log('Simulation files saved');
}
simulate();

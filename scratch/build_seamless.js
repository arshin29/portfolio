const sharp = require('sharp');

async function buildSeamlessDocuMind() {
  const dPath = 'C:/Users/arshi/.gemini/antigravity/brain/19edca05-fe52-44fc-9013-97fe4a643e65/.user_uploaded/media_1794483164516_efbd1cca.webp';

  // 1. Clean banner: 1008 x 232
  const banner = await sharp(dPath)
    .extract({ left: 16, top: 175, width: 1008, height: 232 })
    .toBuffer();

  // Target extended dimensions: 1008 width x 580 height (~16:9.2 or 1.74 : 1)
  // Banner will be placed at y = 180 (top padding: 180px, bottom padding: 168px)
  // Let's create the top wall gradient and bottom desk extension
  
  // Create an SVG background that seamlessly blends into the top row of the banner (y=175) and bottom row (y=407)
  // Let's sample colors across the top row of the banner:
  const rawBanner = await sharp(banner).raw().toBuffer({ resolveWithObject: true });
  // Top row average color: light slate/blue-gray gradient
  // Bottom row average color: clean desk white/gray
  
  // We can also take the full 1024x576 image, but inpaint/cover the 2px black line with a smooth blend!
  // Let's check how the full 1024x576 looks if we just smoothly feather/remove the 2px black border!
  console.log('Testing full image with border removed...');
}
buildSeamlessDocuMind();

import('./assets/three.module-i9PMC45e.js')
  .then((mod) => {
    console.log('SUCCESS! Loaded three.module-i9PMC45e.js! Keys count:', Object.keys(mod).length);
    console.log('Sample exports:', Object.keys(mod).slice(0, 20));
  })
  .catch((err) => {
    console.error('Failed to import three.module-i9PMC45e.js:', err);
  });

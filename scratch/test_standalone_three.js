import('./standalone_three.js')
  .then((mod) => {
    console.log('SUCCESS! Loaded standalone_three.js without errors! Total exported keys:', Object.keys(mod).length);
    console.log('Sample exports:', Object.keys(mod).slice(0, 15));
  })
  .catch((err) => {
    console.error('Error importing standalone_three.js:', err);
  });

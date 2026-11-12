import('./working_three.module.js')
  .then((mod) => {
    console.log('Successfully imported working_three.module.js! Keys count:', Object.keys(mod).length);
  })
  .catch((err) => {
    console.error('Error importing working_three:', err);
  });

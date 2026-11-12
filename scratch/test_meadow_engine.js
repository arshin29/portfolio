globalThis.document = {
  createElement: () => ({ getContext: () => null }),
  head: { appendChild: () => {} },
  addEventListener: () => {},
  removeEventListener: () => {}
};
globalThis.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} })
};

import('../src/components/meadow/meadowEngine.js')
  .then((mod) => {
    console.log('SUCCESS! Loaded meadowEngine.js! Exports:', Object.keys(mod));
  })
  .catch((err) => {
    console.error('Error importing meadowEngine.js:', err);
  });

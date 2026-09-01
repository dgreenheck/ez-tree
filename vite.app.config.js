// Config file for running the demo locally.
//
// Dev (`vite` / `npm run dev`)   → alias points to lib source for instant HMR.
// Prod (`vite build`)            → alias points to the prebuilt lib artifact.
import path from 'path';

/**
 * @type {import('vite').UserConfigFn}
 */
export default ({ command }) => ({
  build: {
    emptyOutDir: true,
    outDir: '../../dist',
    sourcemap: true,
    target: 'esnext',
  },
  root: './src/app',
  optimizeDeps: {
    esbuildOptions: {
      // three/webgpu contains top-level await during renderer feature
      // detection, so dependency pre-bundling must keep modern syntax.
      target: 'esnext',
    },
  },
  resolve: {
    alias: {
      '@dgreenheck/ez-tree': command === 'serve'
        ? path.resolve(__dirname, 'src/lib/index.js')
        : path.resolve(__dirname, 'build/ez-tree.es.js'),
    },
  },
  server: {
    hmr: true,
  },
});

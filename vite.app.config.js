// Config file for running the demo locally
import path from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    emptyOutDir: true,
    outDir: '../../dist',
    sourcemap: true,
  },
  root: './src/app',
  resolve: {
    alias: {
      '@dgreenheck/ez-tree': path.resolve(
        __dirname,
        'build/ez-tree.es.js',
      ),
    },
  },
  server: {
    hmr: true,
  },
  assetsInclude: ['**/*.frag', '**/*.vert'],
};

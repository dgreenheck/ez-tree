// Config file for running the demo locally
import path from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  base: '/tree-js/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  root: './demo',
  resolve: {
    alias: {
      '@dgreenheck/tree-js': path.resolve(
        __dirname,
        'build/@dgreenheck-tree-js.es.js',
      ),
    },
  },
  assetsInclude: ['**/*.frag', '**/*.vert'],
};

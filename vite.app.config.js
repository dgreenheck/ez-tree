// Config file for running the demo locally
import path from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  base: '/eztree/',
  build: {
    emptyOutDir: true,
    outDir: '../../dist',
    sourcemap: true,
  },
  root: './src/app',
  resolve: {
    alias: {
      'eztree': path.resolve(
        __dirname,
        'build/eztree.es.js',
      ),
    },
  },
  assetsInclude: ['**/*.frag', '**/*.vert'],
};

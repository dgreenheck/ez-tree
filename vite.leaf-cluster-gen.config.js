// Config for the leaf-cluster-gen tool. Standalone app that bakes leaf cluster
// atlases via a tiny Three.js scene rendered to canvas.
//
// Shares /textures and other public assets with the main demo by pointing
// publicDir at src/app/public.
import path from 'path';

/**
 * @type {import('vite').UserConfigFn}
 */
export default ({ command }) => ({
  build: {
    emptyOutDir: true,
    outDir: '../../dist-leaf-cluster-gen',
    sourcemap: true,
  },
  root: './src/leaf-cluster-gen',
  publicDir: path.resolve(__dirname, 'src/app/public'),
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
  assetsInclude: ['**/*.frag', '**/*.vert'],
});

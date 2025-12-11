// Config file for running the demo locally
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))


export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
  },
  root: './src/app',
/*   resolve: {
    alias: {
      '@dgreenheck/ez-tree': path.resolve(
        __dirname,
        'build/ez-tree.es.js',
      ),
    },
  }, */
  server: {
    hmr: true,
  },
  assetsInclude: ['**/*.frag', '**/*.vert'],
});

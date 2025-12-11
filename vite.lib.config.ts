
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: './build',
    lib: {
      entry: resolve(__dirname, './src/lib/index.ts'),
      name: '@dgreenheck/ez-tree',
      fileName: (format) => `ez-tree.${format}.js`,
    },
    rollupOptions: {
      external: ['three'],
    },
    
    sourcemap: true,
  },

});
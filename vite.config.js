/**
* @type {import('vite').UserConfig}
*/
export default {
  // Set the base directory for GitHub pages
  base: '/treegen-js/',
  build: {
    outDir: './dist',
    sourcemap: true,
  },
  publicDir: './public',
}
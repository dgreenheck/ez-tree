import dts from "vite-plugin-dts";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    outDir: './build',
    lib: {
      entry: './src/lib/index.js',
      name: '@dgreenheck/ez-tree',
      fileName: (format) => `@dgreenheck/ez-tree.${format}.js`,
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: './build/@dgreenheck',  // All types will be placed under 'build/types'
      insertTypesEntry: true, // Automatically add types field in package.json
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json",
      copyDtsFiles: false
    }),
  ],
};
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
      fileName: (format) => `ez-tree.${format}.js`,
    },
    rollupOptions: {
      external: (id) => id === 'three' || id.startsWith('three/'),
      output: {
        globals: {
          three: 'THREE',
          'three/webgpu': 'THREE',
          'three/tsl': 'THREE',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: './build',
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json"
    }),
  ],
};

import { defineConfig } from 'vite';

// Library build with two entry points: the framework-agnostic core and the React components.
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        react: 'src/react/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Use the host app's React instead of bundling a second copy.
      external: ['react', 'react/jsx-runtime'],
    },
  },
});

import { defineConfig } from 'vite';

// Library build with three entry points: the framework-agnostic core, the React components,
// and the optional Anthropic transport.
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        react: 'src/react/index.ts',
        anthropic: 'src/anthropic.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Use the host app's React and the installed SDK instead of bundling copies.
      external: ['react', 'react/jsx-runtime', /^@anthropic-ai\/sdk/],
    },
  },
});

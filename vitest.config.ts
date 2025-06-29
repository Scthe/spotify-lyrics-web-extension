import { defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';

// https://nextjs.org/docs/app/building-your-application/testing/vitest
export default defineConfig({
  // plugins: [react()],
  test: {
    // environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
    reporters: ['verbose'],
    slowTestThreshold: 2000, // we are doing requests..
  },
  resolve: {
    alias: {
      // '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});

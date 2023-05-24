/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import dns from 'dns';
import path from 'path';
import { defineConfig } from 'vite';
import { dependencies } from './package.json';

dns.setDefaultResultOrder('verbatim');
function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    host: 'localhost',
    strictPort: true,
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    reporters: ['verbose', 'vitest-sonar-reporter'],
    outputFile: {
      'vitest-sonar-reporter': 'test-report.xml',
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      all: true,
      extension: ['tsx', 'ts'],
      include: ['src/*'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/*.d.ts',
        '**/consts/**',
        '**/interfaces/**',
        'src/**/consts.ts',
        'src/**/interfaces.ts',
        'src/main.tsx',
        'src/services/setup/**',
        'src/store/**',
        '**/__test__/**',
        '**/test-config/**'
      ],
      reporter: ['text', 'html', 'lcov'],
    },
    threads: false
  },
  build: {
    outDir: './build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
});

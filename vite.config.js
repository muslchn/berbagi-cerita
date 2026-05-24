import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'), // Changed to root public directory for manifest.json
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      name: 'copy-service-worker',
      closeBundle() {
        // Copy sw.js from src to dist after build
        const srcSw = resolve(__dirname, 'src/sw.js');
        const distSw = resolve(__dirname, 'dist/sw.js');
        
        if (fs.existsSync(srcSw)) {
          fs.copyFileSync(srcSw, distSw);
          console.log('[Vite Plugin] Service Worker copied to dist/sw.js');
        }
      }
    }
  ]
});

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/game/',
  server: {
    port: 18888,
    host: '0.0.0.0',
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

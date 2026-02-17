import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@forgedevstack/forge-auth': path.resolve(__dirname, '../src'),
    },
  },
  define: {
    __FORGE_AUTH_VERSION__: JSON.stringify('1.0.0-alpha'),
  },
});

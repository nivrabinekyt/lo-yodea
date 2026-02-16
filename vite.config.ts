
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // זה ימנע את השגיאה "process is not defined" בדפדפן
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});

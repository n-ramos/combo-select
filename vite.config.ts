import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'examples/**/*'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
      cleanVueFileName: true,
      staticImport: true,
      pathsToAliases: true,
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ComboSelect',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') return 'comboselect.umd.cjs';
        return 'comboselect.js';
      },
    },
    rollupOptions: {
      // Externaliser les dépendances peer si nécessaire
      external: [],
      
      output: {
        // Pas de chunks séparés pour une lib
        inlineDynamicImports: true,
        
        // Noms de fichiers assets
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'asset';
        },
        
        // Configuration UMD
        exports: 'named',
        globals: {},
        
        // Bannière avec infos
        banner: `/*!
 * ComboSelect v0.1.0
 * (c) ${new Date().getFullYear()}
 * @license MIT
 */`,
      },
    },
    
    // Optimisations
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    
    // Optimisation CSS
    cssMinify: 'esbuild',
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  
  // Mode développement
  server: {
    port: 3000,
    open: true,
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: [],
    exclude: ['vitest'],
  },
}));
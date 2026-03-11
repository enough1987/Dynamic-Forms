import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Ensure only one copy of these singletons ends up in the bundle
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
  // Strip console.* calls from production builds only
  esbuild: {
    drop: mode === 'production' ? ['console'] : [],
  },
  // Pre-bundle heavy deps on first dev server start so HMR stays fast
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'formik',
      'zod',
      '@mui/material',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      'json-logic-js',
      'dayjs',
    ],
  },
  build: {
    // Target modern browsers — avoids transpiling syntax they already support,
    // resulting in smaller and faster output
    target: 'es2020',
    // Skip the gzip measurement pass to speed up the build step
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // React + MUI in one chunk — MUI has a hard React dependency so they
          // must be in the same chunk to avoid circular chunk warnings
          'vendor-ui': [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            '@emotion/react',
            '@emotion/styled',
          ],
          // Form / validation utilities
          'vendor-form': ['formik', 'zod', 'zod-formik-adapter', 'json-logic-js', 'dayjs'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
}))

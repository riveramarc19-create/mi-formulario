import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      manifest: {
        name: 'Registro HIS 2025',
        short_name: 'HIS 2025',
        description: 'Aplicación de registro de atenciones de salud',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // ✅ ESTO HACE QUE EL NAVEGADOR ABRA SOLO AL EJECUTAR npm run dev
  server: {
    open: true,
  },
  base: './',
  define: {
    global: 'window',
  },
  build: {
    chunkSizeWarningLimit: 6000,
    target: "esnext",
  },
})

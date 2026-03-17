import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      
      // 👇 AQUÍ ESTÁ EL ÚNICO CAMBIO: AUMENTAMOS EL LÍMITE A 10 MB
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      // 👆 FIN DEL CAMBIO

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

  base: './',

  define: {
    global: 'globalThis',
    'process.env': {},
    '__BUILD_DATE__': JSON.stringify(
      new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'America/Lima' }) + ' ' +
      new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' })
    ),
  },

  build: {
    chunkSizeWarningLimit: 6000,
    target: "esnext",
  },
})
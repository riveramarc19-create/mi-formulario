import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import { viteSingleFile } from "vite-plugin-singlefile" <--- LO COMENTAMOS TEMPORALMENTE PARA QUE LA PWA FUNCIONE EN VERCEL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
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
    // viteSingleFile() <--- LO QUITAMOS PARA VERCEL
  ],

  base: './',

  // 🔥 ESTA ES LA SOLUCIÓN AL ERROR DE EXCEL (LA CONSERVAMOS) 🔥
  define: {
    global: 'window',
  },

  build: {
    chunkSizeWarningLimit: 3000,
    target: "esnext",
    // assetsInlineLimit: 100000000, <--- LO QUITAMOS PARA QUE LA PWA PUEDA CACHEAR ARCHIVOS EFICIENTEMENTE
  },
})
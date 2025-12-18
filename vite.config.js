import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  
  // ESTO ES OBLIGATORIO PARA QUE FUNCIONE EL HTML CON DOBLE CLIC
  base: './', 

  // 🔥 ESTA ES LA SOLUCIÓN AL ERROR DE EXCEL 🔥
  // Le dice al sistema: "Cuando la librería pida 'global', dale 'window'"
  define: {
    global: 'window',
  },

  build: {
    chunkSizeWarningLimit: 3000, 
    target: "esnext", 
    assetsInlineLimit: 100000000, 
  },
})
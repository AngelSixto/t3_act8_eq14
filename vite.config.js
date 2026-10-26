import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La ruta "base" debe coincidir con la carpeta donde se publica en el VPS:
// http://IP_DEL_VPS/t3_act8_eq14/
export default defineConfig({
  plugins: [react()],
  base: '/t3_act8_eq14/',
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  // Конфигурируемый базовый путь для корректных ссылок на хэшированные ассеты
  // Установите VITE_BASE="/подпуть/" при деплое в подпапку
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
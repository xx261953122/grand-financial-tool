import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/grand-financial-tool/', // ✅ 必须和你的仓库名一模一样
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}) 
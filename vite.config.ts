import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wpTarget = env.VITE_WP_PROXY_TARGET?.trim() || 'http://127.0.0.1'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/wp-json': {
          target: wpTarget,
          changeOrigin: true,
          secure: wpTarget.startsWith('https'),
          rewrite: (p) => `/cms${p}`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
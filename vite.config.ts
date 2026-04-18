import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const blobOrigin = env.VITE_BLOB_STORAGE_ORIGIN || 'https://momprojectsa.blob.core.windows.net'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // All requests to /blob-proxy/... are forwarded to Azure Blob Storage
        // server-side — no CORS issue because the proxy makes the request, not the browser.
        '/blob-proxy': {
          target: blobOrigin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/blob-proxy/, ''),
        },
      },
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({   
  plugins: [ react({
    jsxRuntime: 'automatic',  
  }) ],
  resolve: {
    alias: {
      react:  path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
  },
  optimizeDeps: {
    include: ["sonner"],
  },
  ssr: {
    noExternal: ["sonner"],
  },
})
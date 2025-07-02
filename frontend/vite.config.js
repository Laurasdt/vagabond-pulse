import { defineConfig } from 'vite'
export default defineConfig({   
  optimizeDeps: {
    include: ["sonner"],
  },
  ssr: {
    noExternal: ["sonner"],
  },
})
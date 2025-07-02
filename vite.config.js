import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    include: ["sonner"],
  },
  ssr: {
    noExternal: ["sonner"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/styled-engine': '@emotion/styled'
    }
  }
});


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["sonner"],
  },
  ssr: {
    noExternal: ["sonner"],
  },
  plugins: [react()],
});

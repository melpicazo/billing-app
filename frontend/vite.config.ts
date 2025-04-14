import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      components: path.resolve("./src/components"),
      shared: path.resolve("./src/shared"),
      global: path.resolve("./global"),
    },
  },
});

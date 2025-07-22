import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import copy from "rollup-plugin-copy"
import path from "path"
import dynamicImport from "vite-plugin-dynamic-import"

export default defineConfig({
  plugins: [
    react(),
    dynamicImport(),
  ],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
  },
})


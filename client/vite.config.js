import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    {
      name: "copy-redirects",
      closeBundle() {
        // Ensure dist directory exists
        try {
          // Copy _redirects file for SPA routing
          copyFileSync(
            resolve(__dirname, "public/_redirects"),
            resolve(__dirname, "dist/_redirects")
          );
          // Copy render.json for Render.com configuration
          copyFileSync(
            resolve(__dirname, "public/render.json"),
            resolve(__dirname, "dist/render.json")
          );
          console.log("✓ Copied _redirects and render.json to dist/");
        } catch (error) {
          console.error("Error copying redirect files:", error);
        }
      },
    },
  ],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "https://cgpa-analyzer-9-backend.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/_redirects",
          dest: ".", // Copies to dist/ root
        },
      ],
    }),
  ],
  base: "/", // Ensures correct routing for production
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});

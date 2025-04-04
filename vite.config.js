import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures correct routing for production
  build: {
    outDir: "dist", // Default build folder
    emptyOutDir: true,
  },
  server: {
    historyApiFallback: true, // Fixes React Router issues
  },
});

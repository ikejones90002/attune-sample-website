import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Project site served from /attune-sample-website/ on GitHub Pages
  base: "/attune-sample-website/",
  server: {
    host: true,
    allowedHosts: true,
  },
});

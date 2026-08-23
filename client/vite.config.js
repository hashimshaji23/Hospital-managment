import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// this file just tells Vite (our dev server/bundler) to use React
export default defineConfig({
  plugins: [react()],
});

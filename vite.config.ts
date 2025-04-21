/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
*/

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@contexts": path.resolve(__dirname, "./src/contexts"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@components": path.resolve(__dirname, "./src/components"),
      },
    },
    define: {
      "process.env": env, // Makes env variables available globally
    },
  };
});

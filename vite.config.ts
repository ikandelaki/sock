import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, "./src/components"),
      Routes: path.resolve(__dirname, "./src/routes"),
      Hooks: path.resolve(__dirname, "./src/hooks"),
      Types: path.resolve(__dirname, "./src/types"),
      Util: path.resolve(__dirname, "./src/util"),
      Context: path.resolve(__dirname, "./src/context"),
    },
  },
});

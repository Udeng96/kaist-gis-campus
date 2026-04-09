import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

export default defineConfig(({mode}) => {
  const srcNew = path.resolve(__dirname, "src-new");

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 2600,
      sourcemap : true
    },
    define: {
      isDev : mode === "development",
      global: 'globalThis',
    },
    resolve : {
      alias:{
        "@" : srcNew,
        "@api" : path.resolve(srcNew, "api"),
        "@store" : path.resolve(srcNew, "store"),
        "@constants" : path.resolve(srcNew, "constants"),
        "@pages" : path.resolve(srcNew, "pages"),
        "@features" : path.resolve(srcNew, "features"),
        "@assets" : path.resolve(srcNew, "assets"),
        "@components" : path.resolve(srcNew, "components"),
      }
    },
    base: "/kaist/gis/"
  }
})

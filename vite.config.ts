import { vitePlugin as remix} from "@remix-run/dev"
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigpaths from 'vite-tsconfig-paths'
import path from "path"

installGlobals();

export default defineConfig({
    build: {
        sourcemap: false,
    },
    server: {
        port:3000
    },
    plugins: [remix({
        ignoredRouteFiles: ["**/*.css"]
    }), tsconfigpaths()],
    resolve: {
        alias: {
          "@": path.resolve(__dirname, "./@"),
        },
      },
})
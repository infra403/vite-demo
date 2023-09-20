import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: [
          'electron/main.ts',
          'electron/worker/workflows.ts',

        ],
        vite: {
          build: {
            rollupOptions: {
              external: [
                "@temporalio/activity",
                "@temporalio/client",
                "@temporalio/common",
                "@temporalio/core-bridge",
                "@temporalio/proto",
                "@temporalio/worker",
                "@temporalio/workflow"
              ],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
  ],
})
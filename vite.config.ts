import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "src/index.ts"),
      ],
      name: "ColCal",
      formats: ['es'],
      fileName: "col-cal"
    },
    rollupOptions: {
      // Externalize Lit to reduce bundle size
      // Consumers need to include Lit separately (peer dependency)
      external: ['lit', 'lit/decorators.js', 'lit/directives/ref.js'],
      output: {
        // Provide global variable names for externalized deps (for UMD builds)
        globals: {
          'lit': 'lit',
          'lit/decorators.js': 'litDecorators',
          'lit/directives/ref.js': 'litDirectivesRef'
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'

const outDir = path.resolve(__dirname, '../../Build/Studio/publish')

function noTreeShakeForFilesWithEvalPlugin() {
  return {
    name: 'no-tree-shake-for-files-with-eval',
    transform(code) {
      if (code.indexOf('eval(') >= 0)
        return { moduleSideEffects: 'no-treeshake' }
    }
  }
}

export default defineConfig({
  base: "./",
  server: {
    base: "./-/ui/",
    port: 1234,
    hmr: false,
  },
  build: {
    target: 'es2016',
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      plugins: [noTreeShakeForFilesWithEvalPlugin()]
    }
  },
  resolve: {
    dedupe: ['monaco-editor']
  },
  esbuild: {
    target: 'es2016',
  },
  plugins: [tsconfigPaths()]
})

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build as esbuild } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const root = dirname(fileURLToPath(import.meta.url))

{
  await build('index.ts', 'index.js')
  await build('auto.ts', 'auto.js')
  await build('index.js', 'index.cjs', 'cjs')
}

function build(entry, output, format = 'esm') {
  return esbuild({
    format,
    entryPoints: [join(root, 'package', entry)],
    outfile: join(root, 'package', 'dist', output),
    bundle: true,
    platform: 'node',
    target: 'esnext',
    plugins: [
      nodeExternalsPlugin({
        packagePath: 'package/package.json',
      }),
    ],
  })
}

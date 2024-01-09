import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { FluentEnvConfig } from './defaults.ts'
import { setup } from './index.ts'
import { lookupFileLocation } from './shared.ts'

await setup({
  root: resolveRoot(),
} as FluentEnvConfig)

function resolveRoot(): string {
  if (process.argv[1].includes('node_modules')) {
    return process.argv[1].slice(0, process.argv[1].indexOf('/node_modules'))
  }
  const resolvedRoot = dirname(resolve(process.cwd(), process.argv[1]))
  return (
    lookupFileLocation(resolvedRoot, 'env.config.js') ??
    lookupFileLocation(resolvedRoot, 'package.json')
  )
}

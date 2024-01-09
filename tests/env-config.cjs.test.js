import { resolve } from 'node:path'
import { expect, test, vi } from 'vitest'
import { createRequire } from 'node:module'

const { setup } = require('../package/dist/index.cjs')

test('should execute all hooks', async () => {
  const config = await import('./fixtures/env-config/env.config.js')
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  await setup({
    ...config.default,
    root: resolve(__dirname, './fixtures/env-config'),
  })
  for (const hook of [
    'loadEnvironment',
    'createFlags',
    'loadSchema',
    'validateEnvironment',
    'createEnvironment',
  ]) {
    expect(consoleSpy).toHaveBeenCalledWith(hook)
  }
})

import { resolve } from 'node:path'
import { setup } from 'fluent-env'
import { expect, test, vi } from 'vitest'

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

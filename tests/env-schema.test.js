import { resolve } from 'node:path'
import { expect, test, vi } from 'vitest'
import { setup } from '../package/dist/index.js'

test('should execute all hooks', async () => {
  const config = await import('./fixtures/env-schema/env.config.js')
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  await setup({
    ...config.default,
    root: resolve(__dirname, './fixtures/env-schema'),
  })
  for (const hook of [
    'loadEnvironment',
    'createFlags',
    'loadSchema',
    'createContext',
    'createContextGetter',
    'createSchema',
    'validateEnvironment',
    'createEnvironment',
  ]) {
    expect(consoleSpy).toHaveBeenCalledWith(hook)
  }
})

import type { FluentEnvConfig } from './defaults.ts'
import type { Environment, Flags } from './environment.ts'

export function createFlags(config: FluentEnvConfig, env: Environment): Flags {
  const production = env.NODE_ENV === 'production'
  const test = env.APP_ENV === 'test'
  const development = !production

  return {
    name: env.NODE_ENV,
    production,
    development,
    // Convenience flags for Vite compatibility
    PROD: production,
    DEV: development,
  }
}

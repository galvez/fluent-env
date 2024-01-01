export function createFlags(config, env) {
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

import { existsSync } from 'node:fs'
import { join } from 'node:path'

import configDefaults from './defaults.ts'
import type { FluentEnvConfig } from './defaults.ts'

import PrettyError from 'pretty-error'

export { S } from 'fluent-json-schema'

export async function setup(inlineConfig: FluentEnvConfig) {
  const userConfig = await loadConfig(inlineConfig)
  const config: FluentEnvConfig = Object.assign(
    {},
    configDefaults,
    userConfig,
    inlineConfig,
  )
  const env = config.loadEnvironment(config)
  const schema = config.loadSchema(config)
  const pe = new PrettyError()
  try {
    config.createEnvironment(
      config,
      config.validateEnvironment(config, schema, env),
    )
  } catch (error) {
    console.error(pe.render(error))
    process.exit(1)
  }
}

export const defaults = configDefaults

async function loadConfig(config: FluentEnvConfig) {
  const configPath = join(config.root, 'env.config.js')
  if (existsSync(configPath)) {
    const envConfig = await import(configPath)
    const { default: userConfig, ...schema } = envConfig
    Object.assign(config, { ...userConfig, ...config })
    config.schema = schema
    return config
  }
}

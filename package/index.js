import { existsSync } from 'node:fs'
import { join } from 'node:path'
export { S } from 'fluent-json-schema'
import PrettyError from 'pretty-error'
import configDefaults from './defaults.js'

export async function setup(inlineConfig = {}) {
  const userConfig = await loadConfig(inlineConfig)
  const config = Object.assign({}, configDefaults, userConfig, inlineConfig)
  const env = config.loadEnvironment(config)
  const schema = config.loadSchema(config, env)
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

async function loadConfig(config) {
  const configPath = join(config.root, 'env.config.js')
  if (existsSync(configPath)) {
    const envConfig = await import(configPath)
    const { default: userConfig, ...schema } = envConfig
    Object.assign(config, { ...userConfig, ...config })
    config.schema = schema
    return config
  }
}

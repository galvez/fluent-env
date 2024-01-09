import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import * as DotEnv from 'dotenv'
import * as DotEnvExpand from 'dotenv-expand'

import { lookupFileLocation } from './shared.ts'

import type { FluentEnvConfig } from './defaults.ts'

// This file holds the code responsible for
// loading .env and its variants via DotEnv.config()

// Note that DotEnv.config() won't override variables
// once they're set, so the order of calls matches the order
// of loading — which in this case is the same as the one
// used by Vite, as detailed in the README

export type Flags = {
  name: string
} & Record<string, string | boolean>

export type Environment = {
  flags?: Flags
} & Record<string, string | null>

export function loadEnvironment(config: FluentEnvConfig) {
  const env: Environment = {}

  dotEnvIfExists(config, '.env', env)
  dotEnvIfExists(config, '.env.local', env)

  env.flags = config.createFlags(config, env)

  if (env.flags.name) {
    dotEnvIfExists(config, `.env.${env.flags.name}`, env)
    dotEnvIfExists(config, `.env.${env.flags.name}.local`, env)
  }

  if (env.flags.test) {
    dotEnvIfExists(config, '.env.test', env, { override: true })
  }

  return env
}

export function createEnvironment(config, env) {
  process.env = env
}

function dotEnvIfExists(config, filename, env, options = {}) {
  const dir = lookupFileLocation(config.root, filename)
  if (dir) {
    const path = join(dir, filename)
    if (existsSync(path)) {
      DotEnvExpand.expand(DotEnv.config({ path, processEnv: env, ...options }))
    }
  }
}

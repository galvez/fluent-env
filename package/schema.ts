import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createContext as createV8Context, runInContext } from 'node:vm'

import EnvSchema from 'env-schema'
import { S } from 'fluent-json-schema'

import { lookupFileLocation } from './shared.ts'
import {
  warnDuplicateSchemaDefinitions,
  warnMissingSchemaDefinition,
} from './warnings.ts'

import type { JSONSchema } from 'fluent-json-schema'
import type { FluentEnvConfig } from './defaults.ts'

export function loadSchema(config: FluentEnvConfig) {
  const hasExportedSchema =
    config.schema && Object.keys(config.schema).length > 0
  const schemaDir = lookupFileLocation(config.root, '.env.schema')
  if (schemaDir) {
    const schemaPath = join(schemaDir, '.env.schema')
    const schemaPathExists = existsSync(schemaPath)
    if (hasExportedSchema && schemaPathExists) {
      warnDuplicateSchemaDefinitions()
    } else if (schemaPathExists) {
      const schema = readFileSync(schemaPath, 'utf8')
      const vars = {}
      const context = config.createContext(config, vars)
      const isolate = createV8Context(context)
      runInContext(schema, isolate)
      return config.createSchema(vars)
    }
  }
  if (hasExportedSchema) {
    return config.createSchema(config.schema)
  }
  return null
}

export function validateEnvironment(config: FluentEnvConfig, schema, env) {
  if (!schema) {
    return env
  }
  return EnvSchema({ schema, data: env })
}

export function createContextGetter(config: FluentEnvConfig, vars) {
  return (_, prop) => {
    if (prop in S) {
      return S[prop]
    }
    if (prop === 'values') {
      return S.enum
    }
    if (!(prop in vars)) {
      return undefined
    }
    return vars[prop]
  }
}

export function createContext(config: FluentEnvConfig, vars) {
  return new Proxy(
    {},
    {
      get: config.createContextGetter(config, vars),
      set(_, prop, value) {
        vars[prop] = value
        return vars[prop]
      },
    },
  )
}

export function createSchema(vars) {
  let fluentSchema = S.object()
  for (const [prop, value] of Object.entries(vars)) {
    fluentSchema = fluentSchema.prop(prop, value as JSONSchema)
  }
  return fluentSchema
}

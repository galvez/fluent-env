import { z } from 'zod'

export default {
  // JavaScript context getter for the env.schema file
  // This is so that zod methods become globally available
  createContextGetter(config, vars) {
    return (_, prop) => {
      if (prop in z) {
        return z[prop]
      }
      if (prop === 'values') {
        return z.enum
      }
      if (!(prop in vars)) {
        return undefined
      }
      return vars[prop]
    }
  },
  createSchema(vars) {
    return z.object(vars)
  },
  validateEnvironment(config, schema, env) {
    if (!schema) {
      return env
    }
    return schema.parse(env)
  },
}

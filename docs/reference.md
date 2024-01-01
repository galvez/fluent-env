# Reference

This is a reference for **`fluent-env`** configuration options and hooks.

For the main documentation see [`README.md`]().

## `root`

The location where `.env` files and its variants should be loaded from. 

Also the location where `.env.schema` and `env.config.js` should be loaded from.

Automatically inferred when you import **`fluent-env/auto`**. The resolved root will be the one that contains an `env.config.js` or at the very least a `package.json`.

When looking for `.env.schema`, `.env` and other variants, **`fluent-env`** will traverse the file tree upwards until it can find these files, starting from the `root` path.

## `loadEnvironment()`

[dotenv]: https://www.npmjs.com/package/dotenv
[dotenv-expand]: https://www.npmjs.com/package/dotenv-expand

Function responsible for loading the environment via [`dotenv`][dotenv] and [`dotenv-expand`][dotenv-expand]. Once the global `.env` file variants are loaded, `createFlags()` is also executed in order to figure out which environment-specific files to load next.

Below is an `env.config.js` file with the default definition for `loadEnvironment()`:

```js
export default {
  loadEnvironment(config) {
    const env = {}

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
}
```

## `createFlags()`

This function runs after the global `.env` files are loaded, namely `.env` and `.env.local` and is used to populate `env.flags` with a few conveniences. Below is an `env.config.js` file with the default definition for `createFlags()`:

```js
export default {
  createFlags(config, env) {
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
}
```

Note that `NODE_ENV` can only indicate production (server), development or test environments. Most libraries use `NODE_ENV` just to know whether or not you're running Node.js in a server environment, so it's safer to just set it to `production` in all instances where the application runs on a server environment. If you have a staging environment for instance, `NODE_ENV` must also be set to `production` for it as well ([see this video](https://www.youtube.com/watch?v=HMM7GJC5E2o)) so in that case you'll want to have an additional `APP_ENV` variable to indicate your actual application environment.

Be mindful about this when creating your flags.

## `createContextGetter()`

This function is reponsible for return the getter of the `Proxy` object used as the context for the `.env.schema` file. Below is an `env.config.js` file with the default definition for it:

```js
export default {
  createContextGetter(config, vars) {
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
}
```

## `createContext()`

This function is responsible for creating the actual full `Proxy` object used as the context for the `.env.schema` file. This file will look mostly the same for most libraries, what will need customization more often is [`createContextGetter()`](). Nevertheless below is an `.env.config.js` file with the default definition for it:

```js
export default {
  createContext(config, vars) {
    return new Proxy(
      {},
      {
        get(_, prop) {
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
        },
        set(_, prop, value) {
          vars[prop] = value
          return vars[prop]
        },
      },
    )
  }
}
```

## `createSchema()`

This function is responsible for creating your schema object. 

It receives as its single parameter an object with the individual properties of the schema.

By default, a **`fluent-json-schema`** schema object is created.

Below is an `env.config.js` file with the default definition for it:

```js
import { S } from 'fluent-json-schema'

export default {
  createSchema(vars) {
    let fluentSchema = S.object()
    for (const [prop, value] of Object.entries(vars)) {
      fluentSchema = fluentSchema.prop(prop, value)
    }
    return fluentSchema
  }
}
```

## `validateEnvironmen()`

This function is used to validate the loaded environment against the schema.

Below is an `env.config.js` file with the default definition for it:

```js
export default {
  validateEnvironment(config, schema, env) {
    if (!schema) {
      return env
    }
    return EnvSchema({ schema, data: env })
  }
}
```

## `createEnvironment()`

This function is used to the final step in the process which is publishing your environment variables to their final location. Below is an `env.config.js` file with the default definition for it, which just assigns to `process.env`:

```js
export function createEnvironment(config, env) {
  process.env = env
}
```

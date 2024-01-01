# fluent-env

[1]: https://github.com/fastify/env-schema
[2]: https://github.com/fastify/fluent-json-schema

A convenient wrapper around [**`env-schema`**][1] and [**`fluent-json-schema`**][2] to automatically load your schemas from external files, while offering a number of additional configuration hooks.

[![view on npm](https://img.shields.io/npm/v/fluent-env.svg)](https://www.npmjs.org/package/fluent-env)
[![](https://github.com/fastify/fluent-json-schema/workflows/ci/badge.svg)](https://github.com/fastify/fluent-env/actions?query=workflow%3Aci)
[![Coverage Status](https://coveralls.io/repos/github/fastify/fluent-json-schema/badge.svg?branch=master)](https://coveralls.io/github/fastify/fluent-env?branch=main)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- Allows you to set your environment schema in a `.env.schema` file:
  - Parsed as JavaScript and ran in an isolated V8 context.
  - All methods from [**`fluent-json-schema`**][1] exposed as globals.
- Alternatively, allows you set your environment schema via `env.config.js`:
  - Unlike `.env.schema`, an actual JavaScript module.
  - Spports importing subset of variables from another file.
  - Allows use your environment schema as a package

## Install

Use your favorite package manager:

```bash
pnpm add fluent-env
```

```bash
bun install fluent-env
```

```bash
npm i fluent-env           
```

```bash
yarn add fluent-env
```


## Tutorial

1) Create a file named `.env.schema` with your environment schema. All methods from `fluent-json-schema` are **sglobally available** in the scope of this file, the exception is `enum()` which can't be a global due to its status as a reserved keyword, so it's aliased to `values()`.

   ```js
   NODE_ENV=values(['production', 'development', 'test'])
   APPLICATION_ENV=values(['production', 'development', 'staging'])
   POSTGRES_HOST=string().required()
   POSTGRES_PORT=number().default(5432)
   POSTGRES_DB=string().required()
   POSTGRES_USER=string().required()
   POSTGRES_PASS=string().required()
   REDIS_HOST=string().default('localhost')
   REDIS_PORT=number().default(6379)
   REDIS_PASS=string()
   ```

   > If you want to use a different validation library, the global scope of `.env.schema` can be configured by providing your own `createContext()` hook. In that case you'll also need to override the default `validateEnvironment()` definition.

2) Create a file named `.env` with your environment variable values:

   ```bash
   NODE_ENV=production
   APPLICATION_ENV=staging
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=database
   POSTGRES_USER=user
   POSTGRES_PASS=password
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASS=redispassword
   ```

3) In your Node.js application, import `fluent-env/auto` from a file at the same level as your `.env` and `.env.schema` files. The order of loading for `.env` and its variants follows [the Vite standard](./conventions.md).

   ```js
   import 'fluent-env/auto'
   
   console.log(process.env.NODE_ENV)
   console.log(process.env.APPLICATION_ENV)
   console.log(process.env.POSTGRES_HOST)
   console.log(process.env.POSTGRES_PORT)
   console.log(process.env.POSTGRES_DB)
   console.log(process.env.POSTGRES_USER)
   console.log(process.env.POSTGRES_PASS)
   console.log(process.env.REDIS_HOST)
   console.log(process.env.REDIS_PORT)
   console.log(process.env.REDIS_PASS)
   ```

## Setup

**`fluent-env`** can be automatically initialized if you import **`fluent-env/auto`**, as demonstratedd in the tutorial above. In that case, the `root` will be resolved to the path that contains a `package.json` file, the root of the current package. If you import **`fluent-env/auto`** from a subdirectory, it will traverse the file tree upwards looking for the directory that contains `env.config.js` or at the very least `package.json` to determine what the root path is. When looking for `.env.schema`, `.env` and other variants, **`fluent-env`** will traverse the file tree upwards until it can find these files, starting from the `root` path.

> **`fluent-env`** will also detect when it being imported by another CLI, such as **`vitest`**, and will consider the parent directory of the first `node_modules` directory found in the path as the root.

If you want to use a different root for those files, you can import the `setup()` function from **`fluent-env`** (rather than **`fluent-env/auto`**) and call it with a custom `root` option:

```js
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { setup as setupEnvironment } from 'fluent-env'

setupEnvironment({ 
  root: join(dirname(fileURLToPath(import.meta.url)), 'custom/.env/location')
})
```

Note that all `.env` file variants, `.env.schema` and `env.config.js` are all loaded from this same root path.

## Configuration

**``fluent-env``** can be completely customized via the `env.config.js` configuration file. It will either detect its presence when you import **`fluent-env/auto`**, or load it from the path defined in the `root` property passed to the **`setup()`** method's parameters object as demonstrated in the previous example.

If you are using a `.env.schema` file and don't need any customizations, you don't need `env.config.js`. However, if you need to have multiple packages consume the same environment schema and a shared `.env` file, they can be helpful. They also allow to customize how the schema is created and validated, in case you want to use anything other than **`fluent-json-schema`**.

Every named export from `env.config.js` is considered to be an environment variable property definition:

```js
import { S } from 'fluent-json-schema'

export const NODE_ENV = S.values(['production', 'development', 'test'])
export const APPLICATION_ENV = S.values(['production', 'development', 'staging'])
export const POSTGRES_HOST = S.string().required()
export const POSTGRES_PORT = S.number().default(5432)
export const POSTGRES_DB = S.string().required()
export const POSTGRES_USER = S.string().required()
export const POSTGRES_PASS = S.string().required()
export const REDIS_HOST = S.string().default('localhost')
export const REDIS_PORT = S.number().default(6379)
export const REDIS_PASS = S.string()
```

> Unlike `.env.schema`, when exporting your schema from `env.config.js` you are working with a full blown JavaScript module, so a small amount of boilerplate code like importing `fluent-json-schema` manually and exporting consts is needed in this case.

Which you can then import and export from another `env.config.js` file:

```js
export {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASS,
} from 'your-main-app/env.config.js'
```

## Schema

You can use a different validation library in your `.env.schema` file by customizing how the schema is created and used for validation in `env.config.js`.

By providing your own `createSchema()` and `validateEnvironment()` hooks, you can use any other validation library, and by providing your own `createContext()` hook, you can also inject different globals into `.env.schema` (which by default receives a set of global aliases to **`fluent-json-schema`**'s typing functions).

Below is an example of a configuration file to use `zod` instead:

## Execution

**`fluent-env`** has the following setup sequence:

1. `loadEnvironment()` runs loading your `.env` files.
2. `createFlags`() also runs at this point, populating `env.flags`.
3. `createContextGetter()` and `createContext()` run creating the context for `.env.schema`.
4. `loadSchema()` and createSchema()` run creating the full validation schema
5. `validateEnvironment()` validates the environment against the schema
6. `createEnvironment()` populates `process.env` by default.

All of those functions can be overriden.

See the [full reference on configuration options and hooks]().

## Licence

Licensed under [MIT](./LICENSE).

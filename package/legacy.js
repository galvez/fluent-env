// This file exists as a way to expose
// setup() to CommonJS environments.

// The special fluent-env/auto import only works
// in ESM because it uses top-level await,
// but users in CommonJS environments can still
// manually import and run setup()

export { setup, defaults } from './index.ts'

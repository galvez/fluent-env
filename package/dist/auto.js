// package/auto.ts
import { dirname, resolve as resolve3 } from "node:path";

// package/index.ts
import { existsSync as existsSync4 } from "node:fs";
import { join as join4 } from "node:path";

// package/environment.ts
import { existsSync as existsSync2 } from "node:fs";
import { join as join2 } from "node:path";
import * as DotEnv from "dotenv";
import * as DotEnvExpand from "dotenv-expand";

// package/shared.ts
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
function lookupFileLocation(dir, file) {
  if (existsSync(join(dir, file))) {
    return dir;
  }
  const parent = resolve(dir, "..");
  if (parent === dir) {
    return null;
  }
  return lookupFileLocation(parent, file);
}

// package/environment.ts
function loadEnvironment(config2) {
  const env = {};
  dotEnvIfExists(config2, ".env", env);
  dotEnvIfExists(config2, ".env.local", env);
  env.flags = config2.createFlags(config2, env);
  if (env.flags.name) {
    dotEnvIfExists(config2, `.env.${env.flags.name}`, env);
    dotEnvIfExists(config2, `.env.${env.flags.name}.local`, env);
  }
  if (env.flags.test) {
    dotEnvIfExists(config2, ".env.test", env, { override: true });
  }
  return env;
}
function createEnvironment(config2, env) {
  process.env = env;
}
function dotEnvIfExists(config2, filename, env, options = {}) {
  const dir = lookupFileLocation(config2.root, filename);
  if (dir) {
    const path = join2(dir, filename);
    if (existsSync2(path)) {
      DotEnvExpand.expand(DotEnv.config({ path, processEnv: env, ...options }));
    }
  }
}

// package/flags.ts
function createFlags(config2, env) {
  const production = env.NODE_ENV === "production";
  const test = env.APP_ENV === "test";
  const development = !production;
  return {
    name: env.NODE_ENV,
    production,
    development,
    // Convenience flags for Vite compatibility
    PROD: production,
    DEV: development
  };
}

// package/schema.ts
import { existsSync as existsSync3, readFileSync } from "node:fs";
import { join as join3 } from "node:path";
import { createContext as createV8Context, runInContext } from "node:vm";
import EnvSchema from "env-schema";
import { S } from "fluent-json-schema";

// package/warnings.ts
import ProcessWarning from "process-warning";
var warnMissingSchemaDefinition = ProcessWarning.createWarning({
  name: "FluentEnvWarning",
  code: "FNVWRN001",
  message: "Schema definition missing, fluent-env will load all environment variables without validation.",
  unlimited: true
});
var warnDuplicateSchemaDefinitions = ProcessWarning.createWarning({
  name: "FluentEnvWarning",
  code: "FNVWRN002",
  message: "Both .env.schema and env.config.js are trying to define a schema. The schema from .env.schema is disregarded in this case.",
  unlimited: true
});

// package/schema.ts
function loadSchema(config2) {
  const hasExportedSchema = config2.schema && Object.keys(config2.schema).length > 0;
  const schemaDir = lookupFileLocation(config2.root, ".env.schema");
  if (schemaDir) {
    const schemaPath = join3(schemaDir, ".env.schema");
    const schemaPathExists = existsSync3(schemaPath);
    if (hasExportedSchema && schemaPathExists) {
      warnDuplicateSchemaDefinitions();
    } else if (schemaPathExists) {
      const schema = readFileSync(schemaPath, "utf8");
      const vars = {};
      const context = config2.createContext(config2, vars);
      const isolate = createV8Context(context);
      runInContext(schema, isolate);
      return config2.createSchema(vars);
    }
  }
  if (hasExportedSchema) {
    return config2.createSchema(config2.schema);
  }
  return null;
}
function validateEnvironment(config2, schema, env) {
  if (!schema) {
    return env;
  }
  return EnvSchema({ schema, data: env });
}
function createContextGetter(config2, vars) {
  return (_, prop) => {
    if (prop in S) {
      return S[prop];
    }
    if (prop === "values") {
      return S.enum;
    }
    if (!(prop in vars)) {
      return void 0;
    }
    return vars[prop];
  };
}
function createContext(config2, vars) {
  return new Proxy(
    {},
    {
      get: config2.createContextGetter(config2, vars),
      set(_, prop, value) {
        vars[prop] = value;
        return vars[prop];
      }
    }
  );
}
function createSchema(vars) {
  let fluentSchema = S.object();
  for (const [prop, value] of Object.entries(vars)) {
    fluentSchema = fluentSchema.prop(prop, value);
  }
  return fluentSchema;
}

// package/defaults.ts
var defaults_default = {
  root: null,
  loadEnvironment,
  createFlags,
  createContextGetter,
  createContext,
  loadSchema,
  createSchema,
  validateEnvironment,
  createEnvironment
};

// package/index.ts
import PrettyError from "pretty-error";
import { S as S2 } from "fluent-json-schema";
async function setup(inlineConfig) {
  const userConfig = await loadConfig(inlineConfig);
  const config2 = Object.assign(
    {},
    defaults_default,
    userConfig,
    inlineConfig
  );
  const env = config2.loadEnvironment(config2);
  const schema = config2.loadSchema(config2);
  const pe = new PrettyError();
  try {
    config2.createEnvironment(
      config2,
      config2.validateEnvironment(config2, schema, env)
    );
  } catch (error) {
    console.error(pe.render(error));
    process.exit(1);
  }
}
async function loadConfig(config2) {
  const configPath = join4(config2.root, "env.config.js");
  if (existsSync4(configPath)) {
    const envConfig = await import(configPath);
    const { default: userConfig, ...schema } = envConfig;
    Object.assign(config2, { ...userConfig, ...config2 });
    config2.schema = schema;
    return config2;
  }
}

// package/auto.ts
await setup({
  root: resolveRoot()
});
function resolveRoot() {
  if (process.argv[1].includes("node_modules")) {
    return process.argv[1].slice(0, process.argv[1].indexOf("/node_modules"));
  }
  const resolvedRoot = dirname(resolve3(process.cwd(), process.argv[1]));
  return lookupFileLocation(resolvedRoot, "env.config.js") ?? lookupFileLocation(resolvedRoot, "package.json");
}

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// package/index.ts
var package_exports = {};
__export(package_exports, {
  S: () => import_fluent_json_schema2.S,
  defaults: () => defaults,
  setup: () => setup
});
module.exports = __toCommonJS(package_exports);
var import_node_fs4 = require("node:fs");
var import_node_path4 = require("node:path");

// package/environment.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");
var DotEnv = __toESM(require("dotenv"), 1);
var DotEnvExpand = __toESM(require("dotenv-expand"), 1);

// package/shared.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
function lookupFileLocation(dir, file) {
  if ((0, import_node_fs.existsSync)((0, import_node_path.join)(dir, file))) {
    return dir;
  }
  const parent = (0, import_node_path.resolve)(dir, "..");
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
    const path = (0, import_node_path2.join)(dir, filename);
    if ((0, import_node_fs2.existsSync)(path)) {
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
var import_node_fs3 = require("node:fs");
var import_node_path3 = require("node:path");
var import_node_vm = require("node:vm");
var import_env_schema = __toESM(require("env-schema"), 1);
var import_fluent_json_schema = require("fluent-json-schema");

// package/warnings.ts
var import_process_warning = __toESM(require("process-warning"), 1);
var warnMissingSchemaDefinition = import_process_warning.default.createWarning({
  name: "FluentEnvWarning",
  code: "FNVWRN001",
  message: "Schema definition missing, fluent-env will load all environment variables without validation.",
  unlimited: true
});
var warnDuplicateSchemaDefinitions = import_process_warning.default.createWarning({
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
    const schemaPath = (0, import_node_path3.join)(schemaDir, ".env.schema");
    const schemaPathExists = (0, import_node_fs3.existsSync)(schemaPath);
    if (hasExportedSchema && schemaPathExists) {
      warnDuplicateSchemaDefinitions();
    } else if (schemaPathExists) {
      const schema = (0, import_node_fs3.readFileSync)(schemaPath, "utf8");
      const vars = {};
      const context = config2.createContext(config2, vars);
      const isolate = (0, import_node_vm.createContext)(context);
      (0, import_node_vm.runInContext)(schema, isolate);
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
  return (0, import_env_schema.default)({ schema, data: env });
}
function createContextGetter(config2, vars) {
  return (_, prop) => {
    if (prop in import_fluent_json_schema.S) {
      return import_fluent_json_schema.S[prop];
    }
    if (prop === "values") {
      return import_fluent_json_schema.S.enum;
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
  let fluentSchema = import_fluent_json_schema.S.object();
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
var import_pretty_error = __toESM(require("pretty-error"), 1);
var import_fluent_json_schema2 = require("fluent-json-schema");
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
  const pe = new import_pretty_error.default();
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
var defaults = defaults_default;
async function loadConfig(config2) {
  const configPath = (0, import_node_path4.join)(config2.root, "env.config.js");
  if ((0, import_node_fs4.existsSync)(configPath)) {
    const envConfig = await import(configPath);
    const { default: userConfig, ...schema } = envConfig;
    Object.assign(config2, { ...userConfig, ...config2 });
    config2.schema = schema;
    return config2;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  S,
  defaults,
  setup
});

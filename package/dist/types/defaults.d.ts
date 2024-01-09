import { createEnvironment, loadEnvironment } from './environment.ts';
import { createFlags } from './flags.ts';
import { createContext, createContextGetter, createSchema, loadSchema, validateEnvironment } from './schema.ts';
export type FluentEnvConfig = {
    root: string | null;
    schema?: object | null;
    loadEnvironment?: typeof loadEnvironment;
    createFlags?: typeof createFlags;
    createContextGetter?: typeof createContextGetter;
    createContext?: typeof createContext;
    loadSchema?: typeof loadSchema;
    createSchema?: typeof createSchema;
    validateEnvironment?: typeof validateEnvironment;
    createEnvironment?: typeof createEnvironment;
};
declare const _default: FluentEnvConfig;
export default _default;

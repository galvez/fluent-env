import type { FluentEnvConfig } from './defaults.ts';
export declare function loadSchema(config: FluentEnvConfig): import("fluent-json-schema").ObjectSchema<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}>;
export declare function validateEnvironment(config: FluentEnvConfig, schema: any, env: any): any;
export declare function createContextGetter(config: FluentEnvConfig, vars: any): (_: any, prop: any) => any;
export declare function createContext(config: FluentEnvConfig, vars: any): any;
export declare function createSchema(vars: any): import("fluent-json-schema").ObjectSchema<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}>;

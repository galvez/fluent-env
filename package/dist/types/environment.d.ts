import type { FluentEnvConfig } from './defaults.ts';
export type Flags = {
    name: string;
} & Record<string, string | boolean>;
export type Environment = {
    flags?: Flags;
} & Record<string, string | null>;
export declare function loadEnvironment(config: FluentEnvConfig): Environment;
export declare function createEnvironment(config: any, env: any): void;

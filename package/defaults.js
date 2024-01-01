import { createEnvironment, loadEnvironment } from './environment.js'
import { createFlags } from './flags.js'
import {
	createContext,
	createContextGetter,
	createSchema,
	loadSchema,
	validateEnvironment,
} from './schema.js'

export default {
	root: null,
	loadEnvironment,
	createFlags,
	createContextGetter,
	createContext,
	loadSchema,
	createSchema,
	validateEnvironment,
	createEnvironment,
}

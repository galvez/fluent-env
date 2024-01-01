import { S, defaults } from 'fluent-env'

export const FOOBAR = S.string().required()

export default {
	loadEnvironment(...args) {
		console.log('loadEnvironment')
		return defaults.loadEnvironment(...args)
	},
	createFlags(...args) {
		console.log('createFlags')
		return defaults.createFlags(...args)
	},
	createContextGetter(...args) {
		console.log('createContextGetter')
		return defaults.createContextGetter(...args)
	},
	createContext(...args) {
		console.log('createContext')
		return defaults.createContext(...args)
	},
	loadSchema(...args) {
		console.log('loadSchema')
		return defaults.loadSchema(...args)
	},
	createSchema(...args) {
		console.log('createSchema')
		return defaults.createSchema(...args)
	},
	validateEnvironment(...args) {
		console.log('validateEnvironment')
		return defaults.validateEnvironment(...args)
	},
	createEnvironment(...args) {
		console.log('createEnvironment')
		return defaults.createEnvironment(...args)
	},
}

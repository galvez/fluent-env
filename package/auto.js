import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { setup } from './index.js'
import { lookupFileLocation } from './shared.js'

await setup({
	root: resolveRoot(),
})

function resolveRoot() {
	if (process.argv[1].includes('node_modules')) {
		return process.argv[1].slice(0, process.argv[1].indexOf('/node_modules'))
	}
	const resolvedRoot = dirname(resolve(process.cwd(), process.argv[1]))
	return (
		lookupFileLocation(resolvedRoot, 'env.config.js') ??
		lookupFileLocation(resolvedRoot, 'package.json')
	)
}

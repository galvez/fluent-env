import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

export function lookupFileLocation(dir, file) {
	if (existsSync(join(dir, file))) {
		return dir
	}
	const parent = resolve(dir, '..')
	if (parent === dir) {
		return null
	}
	return lookupFileLocation(parent, file)
}

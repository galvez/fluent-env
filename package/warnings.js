import ProcessWarning from 'process-warning'

export const warnMissingSchemaDefinition = ProcessWarning.createWarning({
	name: 'FluentEnvWarning',
	code: 'FNVWRN001',
	message:
		'Schema definition missing, fluent-env will load all environment variables without validation.',
	unlimited: true,
})

export const warnDuplicateSchemaDefinitions = ProcessWarning.createWarning({
	name: 'FluentEnvWarning',
	code: 'FNVWRN002',
	message:
		'Both .env.schema and env.config.js are trying to define a schema. The schema from .env.schema is disregarded in this case.',
	unlimited: true,
})

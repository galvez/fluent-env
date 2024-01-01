import 'fluent-env/auto'

console.log(process.env.ONE_FOOBAR)
console.log(process.env.TWO_FOOBAR) // Should be undefined as it's not defined in the schema

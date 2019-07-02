#!/usr/bin/env node

const H = require('highland')
const argv = require('yargs')
  .option('schemas', {
    alias: 's',
    type: 'array',
    describe: 'JSON Schemas to use (relative paths)'
  })
  .option('id', {
    alias: 'i',
    type: 'string',
    describe: '$id of schema to use for validation'
  })
  .demandOption(['id', 'schemas'], 'Please provide both id and schemas arguments')
  .argv

const Validate = require('./lib/validate')

const schemas = argv.schemas
  .map((path) => require(path))

const validate = Validate.createValidator(argv.id, schemas)

H(process.stdin)
  .split()
  .map((object) => validate(object))
  .errors((err, push) => {
    if (err.name === 'ValidationException') {
      console.error(err.data)
    } else {
      push(err)
    }
  })
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

#! /usr/bin/env node

const util = require('util')
const R = require('ramda')
const H = require('highland')
const JSONStream = require('JSONStream')

const Validate = require('./lib/validate')

function inspect (obj) {
  return util.inspect(obj, {depth: null, colors: true})
}

async function transform (object) {
  return {
    id: object.id,
    verkeerstype: object.verkeerstype,
    datumVanaf: R.reverse(object.vanafdatum.split('-')).join('-'),
    geometry: JSON.parse(object.geo)
  }
}

const validate = Validate.createValidator('milieuzones')

// ============================================================================
// Extract:
// ============================================================================
const milieuzones = process.stdin
  .pipe(JSONStream.parse('milieuzones.*'))

H(milieuzones)
  .map(R.prop('milieuzone'))
// ============================================================================
// Transform:
// ============================================================================
  .flatMap((object) => H(transform(object)))
  .map((object) => validate(object))
  .errors((err, push) => {
    if (err.name === 'ValidationException') {
      console.error('Validation error!!!')
      console.error('Data:')
      console.error(inspect(err.data))
      console.error('Errors:')
      console.error(inspect(err.errors))
    } else {
      push(err)
    }
  })
// ============================================================================
// Load:
// ============================================================================
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

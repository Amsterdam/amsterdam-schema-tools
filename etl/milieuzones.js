#! /usr/bin/env node

const R = require('ramda')
const H = require('highland')

const parseJson = require('../parsers/json')

async function transform (object) {
  return {
    id: object.id,
    verkeerstype: object.verkeerstype,
    datumVanaf: R.reverse(object.vanafdatum.split('-')).join('-'),
    geometry: JSON.parse(object.geo)
  }
}

// ============================================================================
// Extract:
// ============================================================================
H(process.stdin)
  .through(parseJson('milieuzones.*'))
  .map(R.prop('milieuzone'))
// ============================================================================
// Transform:
// ============================================================================
  .flatMap((object) => H(transform(object)))
// ============================================================================
// Load:
// ============================================================================
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

#!/usr/bin/env node

const H = require('highland')
const R = require('ramda')

const features = H(process.stdin)
  .split()
  .compact()
  .map(JSON.parse)
  .map((obj) => ({
    type: 'Feature',
    id: obj.id,
    properties: R.omit(['id', 'geometry'], obj),
    geometry: obj.geometry || null
  }))
  .map(JSON.stringify)
  .intersperse(',\n')

H([
  H(['{"type":"FeatureCollection","features":[']),
  features,
  H([']}\n'])
]).sequence()
  .pipe(process.stdout)
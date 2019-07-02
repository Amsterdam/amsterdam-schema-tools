#! /usr/bin/env node

const R = require('ramda')
const H = require('highland')

const enrich = require('../lib/enrich')
const geo = require('../lib/geo')
const parseXml = require('../parsers/xml')

const text = R.prop('_text')

function ensureArray (item) {
  if (!item) {
    return []
  }

  return item.length ? item : [item]
}

async function transform (object) {
  if (!object.Type._text === 'Pand') {
    // TODO: support multiple types, use subschemas, like `monumenten.pand.schema.json`
    // These exist:
    //   17 ParkTerrein
    //   43 Beeldhouwkunst
    //  100 Complex
    //  164 Bouwwerk
    //  180 Bouwblok
    // 9018 Pand
    return
  }

  let wkt
  if (object.Polygoon) {
    wkt = text(ensureArray(object.Polygoon)[0])
  } else if (object.Punt) {
    wkt = text(ensureArray(object.Punt)[0])
  }

  let geometry
  if (wkt) {
    const geometryRd = geo.parseWkt(wkt)
    geometry = geo.rdGeometryToLatLon(geometryRd)
  }

  let nummeraanduidingUri
  if (object.Adres && object.Adres[0]) {
    const nummeraanduidingId = `0${text(object.Adres[0].VerzendSleutel)}`
    nummeraanduidingUri = await enrich.bag.getNummeraanduiding(nummeraanduidingId)
  }

  return {
    id: text(object.Id),
    dataset: 'monumenten',
    type: 'pand',
    architect: text(object.Architect),
    periodeStart: text(object.periodeStart),
    periodeEind: text(object.periodeEind),
    functie: text(object.Functie),
    geometry,
    beschrijving: object.Tekst && text(object.Tekst.Notitie),
    adres: nummeraanduidingUri
  }
}

// ============================================================================
// Extract:
// ============================================================================
H(process.stdin)
  .through(parseXml('Object'))
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

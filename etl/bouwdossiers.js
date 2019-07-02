#! /usr/bin/env node

const R = require('ramda')
const H = require('highland')

const enrich = require('../lib/enrich')
const parseXml = require('../parsers/xml')

const text = R.prop('_text')

function ensureArray (item) {
  if (!item) {
    return []
  }

  return item.length ? item : [item]
}

function parseDate (str) {
  return R.reverse(str.split('-')).join('-')
}

async function transform (dossier) {
  // TODO: add openbare ruimte list
  const adressen = ensureArray(dossier.adressen.adres)
    .filter((adres) => adres.huisnummerVan)

  const subdossiers = ensureArray(dossier.subDossiers.subDossier)
  const stadsdeelcode = dossier.stadsdeelcode._text
  const dossiernummer = dossier.dossierNr._text

  return {
    id: `${stadsdeelcode}${dossiernummer}`,
    dataset: 'stadsarchief',
    type: 'bouwdossiers',
    dossiernummer: dossier.dossierNr._text,
    titel: dossier.titel._text,
    datering: parseDate(dossier.datering._text),
    dossiertype: dossier.dossierType._text,
    openbaar: dossier.openbaar._text === 'J',
    stadsdeel: await enrich.gebieden.stadsdeelFromCode(stadsdeelcode[1]),
    adressen: (await Promise.all(adressen.map((adres) => enrich.bag.searchVerblijfsobject({
      openbareRuimte: adres.straat._text,
      huisnummer: adres.huisnummerVan._text
      // TODO: also process huisnummerTot
    })))).filter(R.identity),
    subdossiers: subdossiers.map((subdossier) => ({
      titel: subdossier.titel._text,
      bestanden: ensureArray(subdossier.bestanden.url).map(text)
    }))
  }
}

// ============================================================================
// Extract:
// ============================================================================
H(process.stdin)
  .through(parseXml('dossier'))
// ============================================================================
// Transform:
// ============================================================================
  .filter((dossier) => {
    // TODO: this is only temporary!
    const files = ensureArray(dossier.subDossiers.subDossier)
      .map((subdossier) => ensureArray(subdossier.bestanden.url).map(text))
      .flat()

    return files.length
  })
  .flatMap((dossier) => H(transform(dossier)))
// ============================================================================
// Load:
// ============================================================================
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

const fs = require('fs')
const util = require('util')
const R = require('ramda')
const H = require('highland')
const convert = require('xml-js')

const enrich = require('./enrich')
const Validate = require('./validate')

const filename = '/Users/bert/code/amsterdam/bouwdossiers/xml/SAA_BWT_XML_20190417%2FSAA_BWT_01.xml'

const text = R.prop('_text')

function ensureArray (item) {
  if (!item) {
    return []
  }

  return item.length ? item : [item]
}

function inspect (obj) {
  return util.inspect(obj, {depth: null, colors: true})
}

function parseDate (str) {
  return R.reverse(str.split('-')).join('-')
}

async function transform (dossier) {
  // TODO: add openbare ruimte list
  const adressen = ensureArray(dossier.adressen.adres)
    .filter((adres) => adres.huisnummerVan)

  const subdossiers = ensureArray(dossier.subDossiers.subDossier)

  return {
    dossiernummer: dossier.dossierNr._text,
    titel: dossier.titel._text,
    datering: parseDate(dossier.datering._text),
    dossiertype: dossier.dossierType._text,
    openbaar: dossier.openbaar._text === 'J',
    stadsdeel: await enrich.gebieden.stadsdeelFromCode(dossier.stadsdeelcode._text[1]),
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

const validate = Validate.createValidator('bouwdossiers')

const splitTag = 'dossier'

// ============================================================================
// Extract:
// ============================================================================
H(fs.createReadStream(filename))
  .splitBy(`</${splitTag}>`)
  .filter((xml) => xml.trim().startsWith(`<${splitTag}>`))
  .map((xml) => `${xml}</${splitTag}>`)
  .map((xml) => convert.xml2js(xml, {compact: true}).dossier)
  .compact()
// ============================================================================
// Transform:
// ============================================================================
  .flatMap((dossier) => H(transform(dossier)))
  .map((dossier) => validate(dossier))
  .errors((err) => {
    console.error('Validation error!!!')
    console.error('Data:')
    console.error(inspect(err.data))
    console.error('Errors:')
    console.error(inspect(err.errors))
  })
// ============================================================================
// Load:
// ============================================================================
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

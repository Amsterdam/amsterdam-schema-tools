const fetch = require('./cached-fetch')
const querystring = require('querystring')

async function stadsdeelFromCode (code) {
  const url = `https://api.data.amsterdam.nl/gebieden/stadsdeel/?code=${code}`

  return fetch(url)
    .then((data) => data.results[0]._links.self.href)
    .catch(() => {
      console.error(`Can't find Stadsdeel ${code}`)
    })
}

async function searchAddress (string) {
  const url = `https://api.data.amsterdam.nl/atlas/search/adres/?q=${string}`

  return fetch(url)
    .then((data) => data.results[0]._links.self.href)
    .catch(() => {
      console.error(`Can't find Address ${string}`)
    })
}

async function getNummeraanduiding (id) {
  const url = `https://api.data.amsterdam.nl/bag/nummeraanduiding/${id}`

  return fetch(url)
    .then((data) => data._links.self.href)
    .catch(() => {
      console.error(`Can't find Nummeraanduiding ${id}`)
    })
}

async function searchVerblijfsobject (options) {
  const qs = querystring.stringify({
    _huisnummer: options.huisnummer,
    _openbare_ruimte_naam: options.openbareRuimte
  })
  const url = `https://api.data.amsterdam.nl/bag/verblijfsobject/?${qs}`

  return fetch(url)
    .then((data) => data.results[0]._links.self.href)
    .catch(() => {
      console.error(`Can't find Verblijfsobject ${options.openbareRuimte} ${options._huisnummer}`)
    })
}

module.exports = {
  bag: {
    searchVerblijfsobject,
    searchAddress,
    getNummeraanduiding
  },
  gebieden: {
    stadsdeelFromCode
  }
}

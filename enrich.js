const axios = require('axios')

async function stadsdeelFromCode (code) {
  const url = `https://api.data.amsterdam.nl/gebieden/stadsdeel/?code=${code}`
  const response = await axios.get(url)
  return response.data.results[0]._links.self.href
}

async function searchVerblijfsobject (options) {
  const url = `https://api.data.amsterdam.nl/bag/verblijfsobject/?_huisnummer=${options.huisnummer}&_openbare_ruimte_naam=${options.openbareRuimte}`
  const response = await axios.get(url)
  try {
    return response.data.results[0]._links.self.href
  } catch (err) {
  }
}

module.exports = {
  bag: {
    searchVerblijfsobject
  },
  gebieden: {
    stadsdeelFromCode
  }
}

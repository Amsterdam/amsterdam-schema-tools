const H = require('highland')
const convert = require('xml-js')

module.exports = function (splitTag) {
  return H.pipeline(
    H.splitBy(`</${splitTag}>`),
    H.filter((xml) => xml.trim().startsWith(`<${splitTag}>`)),
    H.map((xml) => `${xml}</${splitTag}>`),
    H.map((xml) => convert.xml2js(xml, {compact: true}).dossier)
  )
}

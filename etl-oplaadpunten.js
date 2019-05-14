#! /usr/bin/env node

const util = require('util')
const H = require('highland')

const fetch = require('./lib/cached-fetch')
const enrich = require('./lib/enrich')
const Validate = require('./lib/validate')

const baseUrl = 'https://www.allego.eu/api/feature/experienceaccelerator/areas/chargepointmap/getchargepoints'
const boundsParams = '?firstPoint=52.287,4.768&secondPoint=52.425,5.014'

function inspect (obj) {
  return util.inspect(obj, {depth: null, colors: true})
}

function stringToBoolean (str, strTrue, strFalse, strUndefined) {
  if (str === strTrue) {
    return true
  } else if (str === strFalse) {
    return false
  } else {
    if (strUndefined && str === strUndefined) {
      return
    }
    throw new Error(`Not a valid value: ${str} (${strTrue}/${strFalse})`)
  }
}

async function transform (oplaadpunt) {
  const url = `${baseUrl}/${oplaadpunt.cpId}`

  let data
  try {
    data = await fetch(url)
  } catch (err) {
    console.error(err.message)
    return
  }

  let available
  try {
    available = stringToBoolean(data.chargePointStatus, 'Available', 'Occupied', 'Unknown')
  } catch (err) {
    available = false
  }

  return {
    id: data.id,
    geometry: {
      type: 'Point',
      coordinates: [
        data.location.longitude,
        data.location.latitude
      ]
    },
    address: await enrich.bag.searchAddress(data.address.addressLine1),
    available,
    connected: stringToBoolean(data.connectivityStatus, 'Online', 'Offline', 'Unknown'),
    contact: {
      phone: data.contact.phone ? data.contact.phone : undefined,
      email: data.contact.email ? data.contact.email.trim() : undefined,
      website: data.contact.website ? data.contact.website.trim() : undefined
    },
    capabilities: data.capabilities,
    evses: data.evses.map((evse) => ({
      connectorType: evse.connectorType,
      maxPower: evse.maxPower
    }))
  }
}

const validate = Validate.createValidator('oplaadpunten')

// ============================================================================
// Extract:
// ============================================================================
H(fetch(`${baseUrl}${boundsParams}`))
  .flatten()
// ============================================================================
// Transform:
// ============================================================================
  .flatMap((oplaadpunt) => H(transform(oplaadpunt)))
  .compact()
  .map((oplaadpunt) => validate(oplaadpunt))
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

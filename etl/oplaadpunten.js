#! /usr/bin/env node

const H = require('highland')

const fetch = require('../lib/cached-fetch')
const enrich = require('../lib/enrich')

const baseUrl = 'https://www.allego.eu/api/feature/experienceaccelerator/areas/chargepointmap/getchargepoints'
const boundsParams = '?firstPoint=52.287,4.768&secondPoint=52.425,5.014'

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
    id: data.id.toLowerCase(),
    dataset: 'oplaadpunten',
    type: 'oplaadpunt',
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
    contact: data.contact && {
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
// ============================================================================
// Load:
// ============================================================================
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)

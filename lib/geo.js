const proj4 = require('proj4')
const parseWkt = require('wellknown')

const EPSG_28992 = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs'

function rdCoordinateToLatLon (coordinate) {
  return proj4(EPSG_28992, 'EPSG:4326', coordinate)
}

function rdGeometryToLatLon (geometry) {
  if (geometry.type === 'Point') {
    return {
      type: 'Point',
      coordinates: rdCoordinateToLatLon(geometry.coordinates)
    }
  } else if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates
        .map((linearRing) => linearRing.map((coordinate) => rdCoordinateToLatLon(coordinate)))
    }
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates
        .map((polygon) => polygon
          .map((linearRing) => linearRing.map((coordinate) => rdCoordinateToLatLon(coordinate))))
    }
  } else {
    throw new Error(`Geometry type not supported: ${geometry.type}`)
  }
}

module.exports = {
  rdCoordinateToLatLon,
  rdGeometryToLatLon,
  parseWkt
}

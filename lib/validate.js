const Ajv = require('ajv')

function ValidationException (data, errors) {
  const error = new Error('Validation exception')
  error.name = 'ValidationException'
  error.data = data
  error.errors = errors
  return error
}

module.exports = {
  createValidator: function (dataset) {
    const datasetSchema = require(`../schemas/${dataset}/${dataset}.schema.json`)

    const datapuntSchema = require(`../schemas/datapunt/datapunt.schema.json`)
    const geometrySchema = require(`../schemas/geo/geometry.schema.json`)
    const geometryCollectionSchema = require(`../schemas/geo/geometrycollection.schema.json`)
    const unitsSchema = require(`../schemas/units/units.schema.json`)

    const ajv = new Ajv({schemas: [
      datasetSchema,
      datapuntSchema,
      geometrySchema,
      geometryCollectionSchema,
      unitsSchema
    ]})

    const validate = ajv.getSchema(`https://schemas.data.amsterdam.nl/v0.1/${dataset}`)

    return function (data) {
      const valid = validate(data)
      if (!valid) {
        throw new ValidationException(data, validate.errors)
      }

      return data
    }
  }
}

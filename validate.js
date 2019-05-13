const Ajv = require('ajv')

function ValidationException (data, errors) {
  const error = new Error('Validation exception')
  error.data = data
  error.errors = errors
  return error
}

module.exports = {
  createValidator: function (dataset) {
    const schema = require(`./${dataset}/${dataset}.schema.json`)
    const generalSchema = require(`./datapunt/datapunt.schema.json`)

    const ajv = new Ajv({schemas: [schema, generalSchema]})

    // TODO: make generic!
    const validate = ajv.getSchema('https://schemas.data.amsterdam.nl/v0.1/bouwdossiers')

    return function (data) {
      const valid = validate(data)
      if (!valid) {
        throw new ValidationException(data, validate.errors)
      }

      return data
    }
  }
}

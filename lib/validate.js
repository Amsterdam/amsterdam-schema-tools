const Ajv = require('ajv')

function ValidationException (data, errors) {
  const error = new Error('Validation exception')
  error.name = 'ValidationException'
  error.data = data
  error.errors = errors
  return error
}

module.exports = {
  createValidator: function (schemaId, schemas) {
    const ajv = new Ajv({schemas})

    const validate = ajv.getSchema(schemaId)

    return function (data) {
      const valid = validate(data)
      if (!valid) {
        throw new ValidationException(data, validate.errors)
      }

      return data
    }
  }
}

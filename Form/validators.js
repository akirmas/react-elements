// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Using_propertiesObject_argument_with_Object.create()
export default {
  validate: function(schema, value) {
    let validate = schema
    if (schema === null)
      return;
    if (typeof validate !== 'object') {
      if (!Array.isArray(validate))
        validate = [validate]
      validate = {'allOf': validate}
    }

    let strategy = Object.keys(validate)
    if (strategy.length !== 1)
      return;
    strategy = strategy[0]
    const validators = validate[strategy]

    //NB current proposal - allOf is tolerant for typos, anyOf not
    switch(strategy) {
      case 'allOf':
        return validators
        .every(validator =>
          !(validator in this.validators)
          || this.validators[validator](value)
        )
      case 'anyOf':
        return validators
        .some(
          validator =>
          validator in this.validators
          && this.validators[validator](value)
        )
      default:
        return;
    }
  },
  validators: {
    luhn: (number) =>
      number > 0
      && [
          ...number.toString().replace(/[^0-9]+/g, '')
      ].reverse()
      .map((digit, i) => digit * (1 + i % 2))
      .map(value => value - (value < 10 ? 0 : 9))
      .reduce((sum, v) => sum + v, 0)
      % 10
      === 0,
    isracardDirect: (number) => 
    [
      ...('0'.repeat(9) + number.toString().replace(/[^0-9]+/g, ''))
      .substr(-9)
    ].map((digit, i) => digit * [-2, -3, -4, -5, 5, 4, 3, 2, 1][i])
    .reduce((sum, v) => sum + v, 0)
    % 11
    === 0,
    required: (value) => value !== ''
  }
}
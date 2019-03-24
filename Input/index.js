import React from 'react'

export default (props) => {
  const {
      name = '',
      label = '',
      type = '',
      form_id = '',
      isValid,
      disabled = false,
      required = false,
      style = {},
      parentKey
    } = props,
    params = Object.assign({name}, props)

  const commonParams = (tag, params) =>
    Object.assign(params, {
      'data-parentKey': parentKey,
      className:  [
        capitalizeFirstLetter(tag),
        disabled ? 'Disabled' : '',
        required ? 'Required' : '',
        typeof isValid !== 'undefined' ? isValid === true ? 'Valid' : 'NotValid' : 'NoValidation'
      ].join(' '),
      key: `${tag}${name}`,
      style
    }),
  inputParams = commonParams('input',
    Object.assign(params,
      form_id === '' ? {} : {form: form_id},
      !params.value ? {} : {disabled: true},
      {
        name,
        id: name
      }
    )
  ),
  labelParams = commonParams('label', {
    htmlFor: inputParams.id,
    children: label
  })

  let InputTag = 'input'
  switch (type) {
    case '':
      labelParams.className += ' Title'
      break // if only label is used
    case 'textarea':
      InputTag = 'textarea'
      inputParams.className += ' Textarea'
      break
    case 'list':
      InputTag = 'select'
      inputParams.children = inputParams.items
      .map(({value, label = value}) =>
        <option
          key={`Option${inputParams.name}${label}`}
            {...{value}}
          >
          {label}
        </option>
      )
      break
    case 'year':
    case 'month':
      InputTag = 'select' //TODO: first value is not picked up - generator should be in costructor
      inputParams.children = generate(
        generations[type].count,
        i => {
          const value = i === 0 ? '' : i + generations[type].startValue
          return <option
            key={`Option${inputParams.name}${i}`}
            {...{value}}
          >
            {value}
          </option>
        }
      )
      break
    case 'button':
      inputParams.className += ' Button'
      inputParams.value = label
      break
    case 'submit':
      inputParams.value = label
      inputParams.className += ' Submit Button'
    default:
      if(!commonInputTypes.includes(type))
        return []
      else inputParams.type = type
  }
  if (['textarea', 'select'].includes(InputTag) || type === 'hidden')
    inputParams.value = inputParams.defaultValue
  return <> {
    label === '' || ['submit', 'button', 'hidden'].includes(type)
    ? null
    : <label {...labelParams}/>
  }{
    type === '' ? null : <InputTag {...inputParams}/>
  } </>
}

const generate = (count, lambda) => [...Array(count).keys()].map(lambda)
const generations = {
  month: {
    startValue: 0,
    count: 13
  },
  year: {
    startValue: new Date().getFullYear() - 1,
    count: 22
  }
}
const commonInputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week']

//TODO: move to utils
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

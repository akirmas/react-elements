import React from 'react'
import {capitalizeFirstLetter} from '../../utils'

export default class Input extends React.Component {
  constructor(props) {
    super(props)
    const {duringConstruct} = props
    if (typeof duringConstruct === 'function')
      duringConstruct(props)
  }
  
  render() {
    const {
        name = '',
        label = '',
        type = 'title',
        isvalid,
        disabled = false,
        required = false,
        validator,
        style = {},
        parentKey
      } = this.props,
      params = Object.assign({name}, this.props)
    const commonParams = (tag, params) =>
      Object.assign(params, {
        'data-parentKey': parentKey,
        className:  [
          capitalizeFirstLetter(tag),
          disabled ? 'Disabled' : '',
          required ? 'Required' : '',
          isvalid === true
          ? 'Valid' 
          : isvalid === false
          ? 'NotValid'
          : 'NoValidation',
          typeof validator === 'function' 
          ? capitalizeFirstLetter(validator)
          : '', 
        ].join(' '),
        key: `${tag}${name}`,
        style
      }),
    inputParams = commonParams('input',
      Object.assign(params,
        !params.value ? {} : {disabled: true},
        {
          name,
          id: `${parentKey}/input:${name}`,
        }
      )
    ),
    labelParams = commonParams('label', {
      htmlFor: inputParams.id,
      children: label
    })

    let InputTag = 'input'
    switch (type) {
      case 'title':
        labelParams.className += ` ${capitalizeFirstLetter(type)}`
        break // if only label is used
      case 'textarea':
        InputTag = type
        inputParams.className += ` ${capitalizeFirstLetter(type)}`
        break
      case 'list':
        const result = list(inputParams.name, inputParams.items);
        InputTag = result.tag
        inputParams.children = result.children
        break
      case 'year':
      case 'month':
        //TODO: move to list() with 'generator' key
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

function list(name, items) {
  return {
    tag: 'select',
    children: items
      .map(item => {
      const normalizedItem = typeof item === 'object'
        ? item
        : {value: item},        
        {value, label = value} = normalizedItem
      return <option
        key={`Option${name}${label}`}
          {...{value}}
        >
        {label}
      </option>
    })
  }
}
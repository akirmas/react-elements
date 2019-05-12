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
      name,
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
        const result = list(inputParams.name, inputParams.items, inputParams);
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
      ['', 'title'].includes(type)
      ? null
      : InputTag === ''
      ? inputParams.children
      : <InputTag {...inputParams}/>
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

function list(name, items, {checkbox = false, parentKey = '', onChange} = {}) {
  return {
    tag: checkbox ? '' : 'select',
    children: items.map(item => {
      const itemNormalized = typeof item === 'object'
        ? item
        : {value: item},
        {value, label = value} = itemNormalized,
        key = `${parentKey}${name}${value}`,
        className = [name, value].map(capitalizeFirstLetter).join(' ')
      return checkbox
      ? <>
        <input {...{
          name, value,
          type: 'radio',
          id: key,
          key,
          onChange,
          className: `${className} Input`
        }}/>
        <label {...{
          name,
          className: `${className} Label`,
          htmlFor: key,
          key: `${key}/Label`
        }}>{
          label
        }</label>
      </>
      : <option {...{key, value}}>{label}</option>
    })
  }
}
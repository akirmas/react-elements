import React from 'react'
import {capitalizeFirstLetter} from '../../utils'

import render from '../../utils/renderJson'

export default class Input extends React.Component {
  constructor(props) {
    super(props)
    const {duringConstruct} = props
    if (typeof duringConstruct === 'function')
      duringConstruct(props)
  }
  
  componentWillMount() {
    const {onChange, value, defaultValue, name} = this.props
    onChange({target: {name, value: value || defaultValue}})
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
        parentkey
      } = this.props,
      params = Object.assign({name}, this.props)
      delete params.duringConstruct

    const commonParams = (tag, params) =>
      Object.assign(params, {
        'data-parentkey': parentkey,
        className:  [
          capitalizeFirstLetter(tag),
          disabled ? 'Disabled' : '',
          required ? 'Required' : '',
          ['NoValidation', 'NotValid', 'Valid'][1 + isvalid],
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
          id: `${parentkey}/input:${name}`,
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

    inputParams.value = inputParams.value || inputParams.defaultValue
    delete inputParams.defaultValue

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

function list(name, items, props = {}) {
  const {checkbox = false, parentkey = ''} = props
  return {
    tag: checkbox ? '' : 'select',
    children: items.map(item => {
      const itemNormalized = typeof item === 'object'
        ? item
        : {value: item},
        {value, label = value} = itemNormalized,
        key = `${parentkey}${name}${value}`,
        className = [name, value].map(capitalizeFirstLetter).join(' ')

      return checkbox
      ? <>
        <input { ...Object.assign({}, props, {
          name, value,
          type: 'radio',
          id: key,
          key,
          className: `${className} Input`
        })}/>
        <label {...{
          name,
          className: `${className} Option`,
          htmlFor: key,
          key: `${key}/Option`
        }}>{
          render(label)
        }</label>
      </>
      : <option {...{key, value}}>{label}</option>
    })
  }
}
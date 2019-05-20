import React from 'react'

import Input from '../Input'
import KeyHelper from './KeyHelper'
import Validators from './validators';

import {applier} from '../../utils'
export default class Form extends React.Component {
  state = {
    disabled: false,
    clicked: '',
    inputs: {}
  }

  dataForInjector = []

  inputsToState(inputs) {
    return Object.assign({},
      {inputs},
      ...Object.entries(inputs)
      .map(
        ([name,
          { value = '', defaultValue = '', items = [] }
        ]) => ({
          [
            KeyHelper.data(name)
          ] : items.length > 0
          ? items[0].value
          : defaultValue || value
        })
      )
    )
  }

  constructor(props) {
    super(props);

    ['handleChange', 'pushData', 'ajaxSubmit', 'setDisabled']
    .forEach(method => 
      this[method] = this[method].bind(this)  
    )

    this.dataForInjector = [
      ['dataInjecting', this.pushData],
      ['disable', this.setDisabled]
    ]

    this.onChange = (ev) => {
      this.handleChange(ev)
      if (this.props.onChange instanceof Function)
        this.props.onChange(ev)
    }
    this.state = Object.assign(this.state, this.inputsToState(props.inputs))
  }

  setDisabled({detail: disabled}) {
    this.setState({disabled})
  }

  componentDidMount() {
    applier(this.props.injector, 'addEventListener', this.dataForInjector)
  }  
  componentWillUnmount() {
    applier(this.props.injector, 'removeEventListener', this.dataForInjector)
  }

  collectKeyData() {
    return Object.keys(this.state)
    .filter(k =>  KeyHelper.is(k))
  }

  ajaxSubmit(ev) {
    if (ev && typeof ev.preventDefault === "function")
      ev.preventDefault()

    const setLoaded = () => this.setState({disabled: false}),
      {clicked = '', inputs} = this.state,
      handlerNameBefore = `before${clicked}`,
      handlerNameAfter = `after${clicked}`,
      handlerAfter = handlerNameAfter in this.props ? this.props[handlerNameAfter].bind(this) : () => undefined,
      buttonMeta = inputs[clicked],
      buttonData = 'data' in buttonMeta ? buttonMeta.data : {},
      data0 = Object.assign({},
        ...this.collectKeyData()
        .map(name => ({
          [
            KeyHelper.pure(name)
          ] : this.state[name]
        })),
        buttonData
      ),
      notValidData = Object.entries(data0)
      .filter(([name, value]) =>
        name in inputs
        && 'validate' in inputs[name]
        && !Validators.validate(inputs[name].validate, value)
      )
    if (notValidData.length !== 0) {
      alert(`Data not valid due to:\n${
        notValidData
        .map(([name]) => `${
          inputs[name].label
        } (${
          inputs[name].validate.toString()
        })`)
        .join(', ')
      }`)
      return;
    }
    let result = {}
    const {action, method} = Object.assign({},
        buttonMeta,
        !(handlerNameBefore in this.props)
        ? {}
        : (result = this.props[handlerNameBefore](data0),
          typeof result === 'object'
          ? result
          : {}
        )
      ),
      data = result.data || data0
    this.setState({disabled: true})
    fetch(action, Object.assign(
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Request-Date': new Date().toUTCString()
        }
      },
      ['GET', 'HEAD', undefined].includes(method) ? {} : {body: JSON.stringify(data)}
      )
    )
    .then(response => {
      setLoaded()
      return response
    })
    .then(response => response.text())
    .then(handlerAfter)
    .catch(console.error)
  }

  handleChange({target: {name, value}}) {
    const input = this.state.inputs[name]
    input.isvalid = Validators.validate(input.validate, value);
    this.setState({ [KeyHelper.data(name)]: value })
  }

  pushData({detail: data}) {
    if (!data || typeof data !== 'object')
      return;
    Object.entries(data)
    .forEach(([name = '', value = '']) => {
      const key = KeyHelper.data(name)
      if (name !== '' && value !== '' && value !== this.state[key]) {
        // It is almost copypaste of Input's onChange
        this.setState(
          {[key]: value},
          () => {
            if (typeof this.props.onChange === 'function')
            this.props.onChange({
              target: { name, value: this.state[key] }
            })  
          }
        )
      }
    })
  }

  render() {
    const {className = '', rKey, inputs} = this.props,
      children = Object.keys(inputs).map(
        name => {
          const input = inputs[name],
            {duringConstruct} = this.props,
            dataKey = KeyHelper.data(name),
            stateValue = this.state[dataKey],
            inputProps = Object.assign(
              {
                name,
                className,
                duringConstruct,
                key: `${rKey}/${name}`,
                rKey: `${rKey}/${name}`,
                parentKey: rKey,
                ...input,
                defaultValue: stateValue,
                disabled: this.state.disabled || input.disabled,
                onChange: (ev, ...argv) => {
                  if (stateValue === ev.target.value)
                    return;
                  this.setState({
                    [dataKey] : ev.target.value
                  })
                  this.onChange(ev, ...argv)
                }
              },
              // Signing last click for handler
              (`before${name}` in this.props || `on${name}` in this.props || `after${name}` in this.props || input.type === 'submit')
              ? { onClick: () => {
                this.setState({clicked: name}, () => {
                  this.ajaxSubmit(null, name);
                });
              } }
              : {}
            )
          return <Input {...inputProps}/>
        }
      )
    //TODO return just children - move ajaxSubmit to event-listener or directly to onClick
    return children
  }
}

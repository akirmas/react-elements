import React from 'react'

export default class Hoverize extends React.PureComponent {
  state = {
    hover: false
  }
  eventing(el, event, state) {
    return {
      [event]: (...args) =>
        this.setState(state,
          () => tryCall(el[event], args)
        )
    }
  }
  hovering(el) {
    return el && React.cloneElement(el, Object.assign({}, 
      this.eventing(el, 'onMouseEnter', {hover: true}),
      this.eventing(el, 'onMouseLeave', {hover: false})
    ))
  }

  render() {
    const [ch0, ch1 = null] = arrayify(this.props.children)
    return this.state.hover && ch1
    ? this.hovering(ch1)
    : this.hovering(ch0) 
  }
}

function tryCall(fn, args) {
  return typeof fn === 'function'
  ? fn(...args)
  : fn
}
function arrayify(source) {
  return Array.isArray(source)
  ? source
  : [source]
}
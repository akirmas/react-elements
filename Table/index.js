import React from 'react'

import './index.css'

export default (props) => {
  const {
    className = '',
    data = [],
    headers = {}
  } = props,
  // Clunky way to preserve headers' order - $headersArray as a part
  headers2 = new Map(Object.keys(headers)
    .map((header, i) => [header, i])
  )
  data.forEach(row =>
    Object.keys(row).forEach(
      (header, i) => {
        if (!headers2.has(header))
          headers2.set(header, headers2.size)
      }
    )
  )

  const table = data.map(row =>
    Array.from(headers2).map(
      ([header]) => row[header] 
    )
  ),
  headersArray = Array.from(headers2)
  return <div
    className={`${className} Table`}
  >{
    headersArray.map(
      ([header, i]) => enrichElement(
        headers[header],
        {
          key: 'TH' + i,
          className: `Header ${classNamePrettify(header)} Col${i + 1}`
        }
      )
    )
  }{
    table.map((row, rowIndex) =>
      headersArray.map(
        ([_, i]) => enrichElement(
          row[i],
          {
            key: 'TD' + rowIndex + i,
            className: `Cell ${classNamePrettify(headersArray[i][0])} Col${i + 1} Row${rowIndex + 1}`
          }
        )
      )
    )
  }</div>
}

function enrichElement(el, props, DefaultTag = 'div') {
  return (React.isValidElement(el))
  ? React.cloneElement(el, Object.assign(
    props,
    el.props,
    {className: [classNamePrettify(props.className), classNamePrettify(el.props.className)].join(' ')}
  ))
  : typeof el === 'object'
  ? null
  : <DefaultTag {...props}>{el}</DefaultTag>
}

function classNamePrettify(className = '') {
  return firstToUpperCase(className).replace(':', '-')
}

function firstToUpperCase(str = '') {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

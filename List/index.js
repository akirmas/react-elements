import React from 'react'

export default ({header = '', items, style}) => 
  <div className="List fixed" style={style}>
    {[].concat(
      Object.keys(items).map(src => [
        <img className="List Counter" alt={items[src]} src={src}/>,
        items[src]
      ])
    )}
  </div>

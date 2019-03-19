import React from 'react'

export default ({children, src}) => <div className="SectionHead">
  <img
    className="SectionHead-Img"
    alt="arrow"
    src={src}
  />
  <span className="SectionHead Header">
    {children}
  </span>
</div>
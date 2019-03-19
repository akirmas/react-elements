import React from 'react'

export default ({active=false, children}) =>
  <div className={'Payment Section ' + (active !== 'false' ? 'Active' : 'Passive')}>
    {children}
  </div>

import React from 'react'

import Section from '../Section'

export default ({style, creditCard}) =>
  <Section className="PaymentMethod"active="false" style={style}>
    <p>
      <span className="PaymentMethod Radio"></span>
      {creditCard.text}
    </p>
    <p>
      <img className="PaymentMethod Image" src={creditCard.image} alt="Credit Cards"/>
    </p>
  </Section>

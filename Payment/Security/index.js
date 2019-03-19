import React from 'react'

const secs = [
  {
    title: 'Credit cards',
    src: 'img/cards.png'
  },
  {
    src: 'img/ssl.png', 
    title: "SSL"
  },
  {
    src: 'img/pci.png', 
    title: "PCI"
  },
  {
    src: 'img/comodo.png', 
    title: "comodo"    
  }
];

export default ({style, imgUrl}) =>
  <section className="PaymentSecurity" style={style}>{
    secs.map(({title, src}) =>
      <img alt={title} src={imgUrl(src)}/>
    )
  }</section>

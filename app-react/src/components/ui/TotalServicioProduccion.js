import React from 'react'
import './TotalServicioProduccion.css'

const TotalServicioProduccion = () => {
  return (
    <div className='totalServicioProduccion'>
      <div className='totalServicioProduccion__info'>
        <p className='servicio'>Total horas servicio: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <span>30.50</span>
      </div>
      <div className='totalServicioProduccion__info'>
        <p className='produccion'>Total horas producción: &nbsp;&nbsp;</p>
        <span>320.00</span>
      </div>
    </div>
    // other way of doing it
    // <div className='totalServicioProduccion'>
    //   <div className='totalServicioProduccion__text'>
    //     <p className='servicio'>Total horas servicio:&nbsp;&nbsp;</p>
    //     <p className='produccion'>Total horas servicio:&nbsp;&nbsp;</p>
    //   </div>
    //   <div className='totalServicioProduccion__values'>
    //     <p>30.50</p>
    //     <p>320.00</p>
    //   </div>
    // </div>
  )
}

export default TotalServicioProduccion

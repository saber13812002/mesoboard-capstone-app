import React from 'react'
import { TotalServicioProduccion } from '..'

const ContentHeaderInfo = ({ view }) => {
  // const [infoTo]
  if (view === 'schedule') {
    return <TotalServicioProduccion />
  }

  return (
    <div>
      display total amount component here
    </div>
  )
}

export default ContentHeaderInfo

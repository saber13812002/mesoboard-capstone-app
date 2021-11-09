import { useState, useEffect } from 'react'
import { TotalServicioProduccion } from '..'

const ContentHeaderInfo = ({ view }) => {
  const [displayTotalAmountInfo, setDisplayTotalAmountInfo] = useState(false)
  const [displayTotalProductionInfo, setDisplayTotalProductionInfo] = useState(false)

  useEffect(() => {
    if (view === 'schedule') {
      setDisplayTotalProductionInfo(true)
      setDisplayTotalAmountInfo(false)
    }
    else if (view === 'profiles') {
      setDisplayTotalAmountInfo(true)
      setDisplayTotalProductionInfo(false)
    }
    else {
      setDisplayTotalAmountInfo(false)
      setDisplayTotalProductionInfo(false)
    }
  }, [view])

  return (
    <>
      {displayTotalAmountInfo && <p>display total amount component here</p>}
      {displayTotalProductionInfo && <TotalServicioProduccion />}
    </>
  )
}

export default ContentHeaderInfo

import { useState, useEffect } from 'react'
import './ContentHeader.css'
import { ContentHeaderInfo } from '..'

const ContentHeader = ({ view }) => {
  const [header, setHeader] = useState('')
  useEffect(() => {
    switch (view) {
      case 'home':
        setHeader('inicio'); break;
      case 'schedule':
        setHeader('horarios'); break;
      case 'request':
        setHeader('solicitudes'); break;
      case 'memo':
        setHeader('memos'); break;
      case 'checks':
        setHeader('talonarios'); break;
      case 'profiles':
        setHeader('perfiles'); break;
    }
  }, [view])

  return (
    <div className='contentHeader'>
      <div className='contentHeader__container'>
        <h2>{header}</h2>
        <ContentHeaderInfo view={view} />
      </div>
      <hr />
    </div>
  )
}

export default ContentHeader

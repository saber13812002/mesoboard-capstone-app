import { useState, useEffect } from 'react'
import './ContentHeader.css'
import { urlSlugs } from '../../services/urlService'
import { ContentHeaderInfo } from '..'

const ContentHeader = ({ view }) => {
  const [header, setHeader] = useState('')
  const { home, schedule, profiles, requests, memos, permissions } = urlSlugs;

  useEffect(() => {
    switch (view) {
      case home:
        setHeader('Inicio'); break;
      case schedule:
        setHeader('Horarios'); break;
      case requests:
        setHeader('Solicitudes'); break;
      case memos:
        setHeader('Memorandos'); break;
      case profiles:
        setHeader('Perfiles'); break;
      default:
        setHeader('Permisos de Usuario'); break;
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

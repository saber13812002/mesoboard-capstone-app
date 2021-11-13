// import { urlPaths } from './urlService'


export const sidebarItemNames = {
  home: 'Home',
  schedule: 'Schedule',
  profiles: 'Perfiles',
  checks: 'Talonarios',
  requests: 'Solicitudes',
  memos: 'Memorandos',
  permissions: 'Permisos de Usuario'
}

export const setSidebarActiveItemNameByUrlPath = (setState) => {

  // export const getSidebarActiveItemNameByUrlPath = () => {
  const pathname = window.location.pathname
  let activeItemName = sidebarItemNames.home
  if (pathname.includes('/schedule')) {
    activeItemName = sidebarItemNames.schedule
  } if (pathname.includes('/profiles')) {
    activeItemName = sidebarItemNames.profiles
  } else if (pathname.includes('/checks')) {
    activeItemName = sidebarItemNames.checks
  } else if (pathname.includes('/requests')) {
    activeItemName = sidebarItemNames.requests
  } else if (pathname.includes('/memos')) {
    activeItemName = sidebarItemNames.memos
  }
  else if (pathname.includes('/permissions')) {
    activeItemName = sidebarItemNames.permissions
  }
  setState(activeItemName)
}
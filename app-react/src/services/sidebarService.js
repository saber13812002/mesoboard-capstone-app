// import { urlPaths } from './urlService'
import { iconComponents } from '../components'
import { urlPaths } from '../services/urlService'

export class SidebarItem {
  constructor(item) {
    this.item = item
    this.next = null
  }

  setNext(item) {
    const savedItem = this.next
    this.next = item
    if (savedItem !== null)
      item.next = savedItem;
  }

  toArray() {
    const arr = [];
    let curr = this;
    while (curr != null) {
      arr.push(curr.item);
      curr = curr.next;
    }
    return arr;
  }
}

export const sidebarItemNames = {
  home: 'Home',
  schedule: 'Schedule',
  profiles: 'Perfiles',
  checks: 'Talonarios',
  requests: 'Solicitudes',
  memos: 'Memorandos',
  permissions: 'Permisos de Usuario'
}

export const allLinks = {
  HOME: {
    to: urlPaths.home,
    name: sidebarItemNames.home,
    IconComponent: iconComponents.Home,
  },
  SCHEDULE: {
    to: urlPaths.schedule,
    name: sidebarItemNames.schedule,
    IconComponent: iconComponents.Calendar,
  },
  PROFILES: {
    to: urlPaths.profiles,
    name: sidebarItemNames.profiles,
    IconComponent: iconComponents.Profile,
  },
  CHECKS: {
    to: urlPaths.checks,
    name: sidebarItemNames.checks,
    IconComponent: iconComponents.MoneyCheck,
  },
  REQUESTS: {
    to: urlPaths.requests,
    name: sidebarItemNames.requests,
    IconComponent: iconComponents.Requests,
  },
  MEMOS: {
    to: urlPaths.memos,
    name: sidebarItemNames.memos,
    IconComponent: iconComponents.Memos,
  },
  PERMISSIONS: {
    to: urlPaths.permissions,
    name: sidebarItemNames.permissions,
    IconComponent: iconComponents.Permissions,
  },
}

export const setSidebarActiveItemNameByUrlPath = setter => {

  // export const getSidebarActiveItemNameByUrlPath = () => {
  const pathname = window.location.pathname;
  let activeItemName = sidebarItemNames.home;
  if (pathname.includes('/schedule')) {
    activeItemName = sidebarItemNames.schedule;
  } if (pathname.includes('/profiles')) {
    activeItemName = sidebarItemNames.profiles;
  } else if (pathname.includes('/checks')) {
    activeItemName = sidebarItemNames.checks;
  } else if (pathname.includes('/requests')) {
    activeItemName = sidebarItemNames.requests;
  } else if (pathname.includes('/memos')) {
    activeItemName = sidebarItemNames.memos;
  }
  else if (pathname.includes('/permissions')) {
    activeItemName = sidebarItemNames.permissions;
  }
  setter(activeItemName);
}
import { urlSlugs } from './urlService'
import { iconComponents } from '../components'
import { urlPaths } from '../services/urlService'

export class SidebarItem {
  constructor(item) {
    this.item = item;
    this.next = null;
  }

  setNext(item) {
    const savedItem = this.next;
    this.next = item;
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

  /** clear all next references  */
  clearAll() {
    let curr = this;
    let prev = this;
    let currNext = this.next;

    // clear all references
    while (currNext != null) {
      const savedNext = curr.next;
      prev = curr;
      curr = savedNext;
      currNext = savedNext?.next;

      prev.next = null;
      prev = null;
    }
    // console.log('this', this)
  }

  toString() {
    let s = '';
    let curr = this;
    while (curr != null) {
      s += curr;
      if (curr.next != null)
        s += ',';
      curr = curr.next;
    }
    return s;
  }
}

export const sidebarItemNames = {
  home: 'Inicio',
  schedule: 'Horarios',
  profiles: 'Perfiles',
  // checks: 'Talonarios',
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
  // CHECKS: {
  //   to: urlPaths.checks,
  //   name: sidebarItemNames.checks,
  //   IconComponent: iconComponents.MoneyCheck,
  // },
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
  const pathname = window.location.pathname;
  const { schedule, profiles, requests, memos, permissions } = urlSlugs;
  const includes = slug => pathname.includes(`/${slug}`);

  let activeItemName = sidebarItemNames.home;
  if (includes(schedule))
    activeItemName = sidebarItemNames.schedule;
  else if (includes(profiles))
    activeItemName = sidebarItemNames.profiles;
  else if (includes(requests))
    activeItemName = sidebarItemNames.requests;
  else if (includes(memos))
    activeItemName = sidebarItemNames.memos;
  else if (includes(permissions))
    activeItemName = sidebarItemNames.permissions;

  setter(activeItemName);
}
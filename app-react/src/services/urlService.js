// export const pathHome = '/app/home'
// export const pathSchedule = '/app/schedule'
// export const pathProfiles = '/app/profiles'
// export const pathRequests = '/app/requests'
// export const pathChecks = '/app/checks'
// export const pathMemo = '/app/memos'
export const urlPaths = {
  // transfer above to here
  home: '/app/home',
  schedule: '/app/schedule',
  profiles: '/app/profiles',
  requests: '/app/requests',
  checks: '/app/checks',
  memos: '/app/memos',
  permissions: '/app/permissions'
}

export const isPathHome = () => window.location.pathname.includes('/home')
export const isPathSchedule = () => window.location.pathname.includes('/schedule')
export const isPathProfiles = () => window.location.pathname.includes('/profiles')
export const isPathChecks = () => window.location.pathname.includes('/checks')
export const isPathRequests = () => window.location.pathname.includes('/requests')
export const isPathMemos = () => window.location.pathname.includes('/memos')
export const isPathPermissions = () => window.location.pathname.includes('/permissions')



/** returns the slug of the given url. */
export const urlSlug = url => url.substring(url.lastIndexOf('/') + 1)

/** returns the given url without the slug. */
export const domainUrl = url => url.substring(0, url.lastIndexOf('/'))


export const pathHome = '/app/home'
export const pathSchedule = '/app/schedule'
export const pathProfiles = '/app/profiles'
export const pathRequests = '/app/requests'
export const pathChecks = '/app/checks'
export const pathMemo = '/app/memo'
export const paths = {
  // transfer above to here please. For future use
}

/** returns the slug of the given url. */
export const urlSlug = url => url.substring(url.lastIndexOf('/') + 1)

/** returns the given url without the slug. */
export const domainUrl = url => url.substring(0, url.lastIndexOf('/'))


export const urlSlugs = {
  signin: 'iniciar',
  authenticate: 'autenticar',
  forgotPassword: 'forgot-password',
  profile: 'perfil',
  // home: 'inicio',
  schedule: 'horarios',
  profiles: 'perfiles',
  // requests: 'solicitudes',
  // memos: 'memorandos',
  permissions: 'permisos'
}

export const urlPaths = {
  // transfer above to here
  profile: `/app/${urlSlugs.profile}`,
  // home: `/app/${urlSlugs.home}`,
  schedule: `/app/${urlSlugs.schedule}`,
  profiles: `/app/${urlSlugs.profiles}`,
  // requests: `/app/${urlSlugs.requests}`,
  // checks: `/app/${urlSlugs.checks}`,
  // memos: `/app/${urlSlugs.memos}`,
  permissions: `/app/${urlSlugs.permissions}`
}

export const isPathSignin = () => window.location.pathname.includes(`/${urlSlugs.signin}`);
export const isPathAuthenticate = () => window.location.pathname.includes(`/${urlSlugs.authenticate}`);
export const isPathForgotPassword = () => window.location.pathname.includes(`/${urlSlugs.forgotPassword}`);
// export const isPathHome = () => window.location.pathname.includes(`/${urlSlugs.home}`);
export const isPathProfile = () => window.location.pathname.includes(`/${urlSlugs.profile}`);
export const isPathSchedule = () => window.location.pathname.includes(`/${urlSlugs.schedule}`);
export const isPathProfiles = () => window.location.pathname.includes(`/${urlSlugs.profiles}`);
// export const isPathRequests = () => window.location.pathname.includes(`/${urlSlugs.requests}`);
// export const isPathChecks = () => window.location.pathname.includes(`/${urlSlugs.checks}`);
// export const isPathMemos = () => window.location.pathname.includes(`/${urlSlugs.memos}`);
export const isPathPermissions = () => window.location.pathname.includes(`/${urlSlugs.permissions}`);

/** returns the slug of the given url. */
export const getUrlSlug = url => url.substring(url.lastIndexOf('/') + 1)

/** returns the given url without the slug. */
export const domainUrl = url => url.substring(0, url.lastIndexOf('/'))
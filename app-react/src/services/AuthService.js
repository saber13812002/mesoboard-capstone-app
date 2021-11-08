import moment from 'moment'

export const setLocalStorage = ({ token, expiresIn }) => {
  const expires = moment().add(expiresIn, 'days');
  localStorage.setItem('expiresIn', JSON.stringify(expires.valueOf()))
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const logoutStorage = () => {
  console.log('logoutStorage')
  localStorage.removeItem('token')
  localStorage.removeItem('expiresIn')
}

export const isLoggedIn = () => {
  return moment().isBefore(getExpiration())
}

export const isLoggedOut = () => {
  console.log(localStorage.getItem('expiresIn'))
  if (!localStorage.getItem('expiresIn')) return true
  console.log('isLoggedOut service', !moment().isBefore(getExpiration()))
  return !isLoggedIn()
}

const getExpiration = () => {
  const expiration = localStorage.getItem('expiresIn')
  const expiresAt = JSON.parse(expiration)
  return moment(expiresAt)
}

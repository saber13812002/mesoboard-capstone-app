import moment from 'moment'

export const setLocalStorage = ({ token, exp, userId }) => {
  const expiresIn = moment().add(exp, 'days');
  localStorage.setItem('exp', JSON.stringify(expiresIn.valueOf()))
  localStorage.setItem('token', token)
  localStorage.setItem('sub', userId)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const logoutStorage = () => {
  console.log('logoutStorage')
  localStorage.removeItem('token')
  localStorage.removeItem('exp')
  localStorage.removeItem('sub')
}

export const verifyCredentialsToLogin = () => {
  const isLogged = isLoggedIn()

  if (isLogged) {

  }
  else {
    // then logout
  }
  return isLogged
}

export const isLoggedIn = () => {
  return moment().isBefore(getExpiration())
}

export const isLoggedOut = () => {
  console.log(localStorage.getItem('exp'))
  if (!localStorage.getItem('exp')) return true
  // console.log('isLoggedOut service', !moment().isBefore(getExpiration()))
  return !isLoggedIn()
}

const getExpiration = () => {
  const expiration = localStorage.getItem('exp')
  const expiresAt = JSON.parse(expiration)
  return moment(expiresAt)
}

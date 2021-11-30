import moment from 'moment';
import axios from 'axios';

export const setLocalStorage = ({ token, exp, userId }) => {
  const expiresIn = moment().add(exp, 'days');
  console.log('<token>', token)
  localStorage.setItem('sub', userId);
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  localStorage.setItem('exp', JSON.stringify(expiresIn.valueOf()));
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const logoutStorage = () => {
  // console.log('logoutStorage');
  localStorage.removeItem('token');
  localStorage.removeItem('exp');
  localStorage.removeItem('sub');
}

export const isLoggedIn = () => moment().isBefore(getExpiration())

export const isLoggedOut = () => {
  if (!localStorage.getItem('exp')) return true;
  return !isLoggedIn();
}

const getExpiration = () => {
  const expiration = localStorage.getItem('exp');
  const expiresAt = JSON.parse(expiration);
  return moment(expiresAt);
}

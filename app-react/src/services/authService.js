import moment from 'moment';
import axios from 'axios';

export const setLocalStorage = ({ token, exp, userId }) => {
  const expiresIn = moment().add(exp, 'days');
  // console.log('<token>', token)
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

export const userTypes = {
  admin: {
    label: 'Administrator',
    value: 'admin',
    // dbValue: 'admin'
  },
  manager: {
    label: 'Supervisor',
    value: 'manager',
    // dbValue: 'manager'
  },
  employee: {
    label: 'Empleado',
    value: 'employee',
    // dbValue: 'employee'
  }
}

export const genders = [{
  id: 0,
  label: 'Masculino',
  value: 'male'
}, {
  id: 1,
  label: 'Fémina',
  value: 'female'
}, {
  id: 2,
  label: 'Prefiero no revelar',
  value: 'pnr'
}, {
  id: 3,
  label: 'Otro',
  value: 'otro'
}]


// should be in a generalService.js file
export const truncateLocation = (l, n) => (l.length < 26) ? l : l.substr(0, n ? n : 24) + '...'

export const truncateNotificationText = (s, n) => (s.length < 52) ? s : s.substr(0, n ? n : 52) + '...'

import { setLocalStorage } from '../services/authService'

const types = {
  VERIFY: 'VERIFY',
  LOGIN: 'LOGIN',
  RESET: 'RESET'
}

const AuthReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN: {
      const { user_id, first_name, last_name, email, password, user_type, gender, token, expiresIn } = payload
      console.log('-expiresIn', expiresIn)
      console.log('email', email)

      if (token && expiresIn)
        setLocalStorage({ token, expiresIn })

      return {
        ...state,
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        email,
        password,
        userType: user_type,
        gender,
      }
    }
    case types.VERIFY: {
      console.log('VERFIY')
      return {
        ...state,
        userType: payload.permission_type
      }
    }
    case types.RESET: {
      console.log('RESET', payload)
      return payload
    }
    default:
      return state;
  }
}

export default AuthReducer;
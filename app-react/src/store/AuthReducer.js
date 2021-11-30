import { setLocalStorage } from '../services/authService'

const types = {
  RESET: 'RESET',
  VERIFY: 'VERIFY',
  LOGIN: 'LOGIN',
  SET_USER: 'SET_USER',
}

const AuthReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_USER: {
      const { user_id, first_name, last_name, email, user_type, gender } = payload
      return {
        // ...state,
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        email,
        userType: user_type,
        gender,
      }
    }
    case types.LOGIN: {
      const { user_id, first_name, last_name, email, user_type, gender, token, exp } = payload
      console.log('-exp', exp)
      console.log('email', email)

      if (token && exp)
        setLocalStorage({ token, exp, userId: user_id })

      return {
        ...state, //not neccessary I think
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        email,
        userType: user_type,
        gender,
      }
    }
    case types.VERIFY: {
      return {
        ...state,
        userType: payload.permission_type
      }
    }
    case types.RESET: {
      return payload
    }
    default:
      return state;
  }
}

export default AuthReducer;
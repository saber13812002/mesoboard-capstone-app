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
      const { user_id, first_name, last_name, email, user_type, gender, location, employee_id } = payload
      return {
        // ...state,
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        email,
        userType: user_type,
        gender,
        location,
        employeeId: employee_id
      }
    }
    case types.LOGIN: {
      const { user_id, first_name, last_name, email, user_type, gender, location, employee_id, token, exp } = payload
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
        location,
        employeeId: employee_id
      }
    }
    case types.VERIFY: {
      const { permission_type, email, location, employee_id, restaurant_id } = payload;
      // console.log(permission_type, employee_id, location, restaurant_id)
      return {
        ...state,
        userType: permission_type,
        email,
        location,
        employeeId: employee_id,
        restaurantId: restaurant_id,
      }
    }
    case types.RESET: {
      console.log('payload', payload)
      return payload
    }
    default:
      return state;
  }
}

export default AuthReducer;
const types = {
  SIGNIN: 'SIGNIN',
  SIGNOUT: 'SIGNOUT',
  REGISTER: 'REGISTER'
}

const AuthReducer = (state, action) => {
  console.log('state, action:', state, action)
  const { type, payload } = action;

  switch (type) {
    case types.SIGNIN: {
      const { email, password, token } = payload
      if (token)
        localStorage.setItem('token', token)

      return {
        ...state,
        user: { email, password },
        token
      }
    }
    case types.SIGNOUT: {
      return state;
    }
    case types.REGISTER: {
      return state;
    }
    default:
      return state;
  }
}

export default AuthReducer;
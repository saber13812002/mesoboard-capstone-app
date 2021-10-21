import { useReducer } from 'react'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'

const AuthProvider = ({ children }) => {
  const initialAuthState = {
    user: undefined,
    token: localStorage.getItem('token')
  }

  const [authState, dispatchAuthAction] = useReducer(AuthReducer, initialAuthState)

  const signinHandler = async (user) => {
    const data = {
      code: '2212',
      password: 'test123'
    }

    dispatchAuthAction({
      type: 'SIGNIN',
      // payload: { ...res, code: data.code }
      payload: {
        token: 'sdfjoashfasfho', code: data.code
      }
    })
    // await fetch('/api/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data)
    // }) //dummy url to simulate fetch
    //   // .then(data => console.log('data', data))
    //   .then(data => data.json())
    //   .then(res => {
    //     dispatchAuthAction({
    //       type: 'SIGNIN',
    //       payload: { ...res, code: data.code }
    //     })
    //   })
  }

  const signoutHandler = user => {
    // dispatchAuthAction({
    //   type: 'SIGNOUT',
    //   payload: user //or just the token
    // })
  }

  const verifyPermissionHandler = user => {
    // dispatchAuthAction({
    //   type: 'REGISTER',
    //   payload: user
    // })
  }

  const authContext = {
    user: authState?.user,
    token: authState?.token,
    signin: signinHandler,
    signout: signoutHandler,
    verifyPermission: verifyPermissionHandler
  }

  return <AuthContext.Provider value={authContext}>
    {children}
  </AuthContext.Provider>
}

export default AuthProvider
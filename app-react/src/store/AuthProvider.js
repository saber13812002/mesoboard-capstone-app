import { useReducer } from 'react'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'
import axios from 'axios'
import { logoutStorage } from '../services/authService'
import { ServerRoutes as server } from '../services/apiService'

const AuthProvider = ({ children }) => {

  const initState = {
    userId: undefined,
    employeeId: undefined,
    restaurantId: undefined,
    location: undefined,
    firstName: '',
    lastName: '',
    email: '',
    userType: '',
    gender: '',
  }
  const [authState, dispatchAuthAction] = useReducer(AuthReducer, initState)

  /** Reset this context state to its initial state */
  const resetState = () => dispatchAuthAction({ type: 'RESET', payload: initState })

  const fetchUserDataByToken = async () => {
    const getUserData = async () => {
      axios.get(server.getUserData()).then(res => {
        // console.log('getUserData res.data', res.data)
        dispatchAuthAction({
          type: 'SET_USER',
          payload: res.data,
        })
        return res
      })
    }
    getUserData()
  }

  const signinFetch = async (userInfo, setRedirect) => {
    const { email, password } = userInfo;
    // console.log('signinFetch', email, password)
    const signin = async () => {
      axios.post(server.login(), { email, password }).then(async res => {
        // console.log('res.data', res.data)
        const { user_id, token } = res.data
        console.log(user_id)
        return verifyTokenAndGetUserInfoFetch(user_id, token, setRedirect)
      })
    }
    signin()
  }

  const signupFetch = async (userInfo, codeToRemove, setRedirectToApp) => {
    const signup = async () => {
      userInfo['code'] = codeToRemove;

      axios.post(server.signup(), userInfo)
        .then(res => {
          // console.log('res', res.data)
          const { user_id, token } = res.data
          verifyTokenAndGetUserInfoFetch(user_id, token, setRedirectToApp)
        })
        .catch(err => {
          console.log('err', err)
          if (err.response.status)
            console.log('msg', err.response.status)
        })
    }
    signup()
  }

  const verifyTokenAndGetUserInfoFetch = async (user_id, token, setRedirectToApp) => {
    const verifyTokenGetUser = async () => {
      console.log('verifyTokenGetUser', user_id)
      axios.post(server.verifyTokenAndGetUser(), { user_id, token })
        .then(res => {
          // console.log('verifyTokenGetUser dispatch LOGIN', res.data)
          dispatchAuthAction({
            type: 'LOGIN',
            payload: { ...res.data },
          })
          return setRedirectToApp
        })
        .then(_ => {
          console.log('Redirecting to app\'s layout')
          setRedirectToApp(true)
        })
        .catch(err => {
          console.log('err', err)
          if (err.response.status)
            console.log('msg', err.response.status)
        })
    }
    verifyTokenGetUser()
  }

  const verifyPermissionFetch = async (email, code) => {
    const verifyPermission = async () => {
      // console.log('code', code)
      //Will be modified to search for already created users
      return axios.post(server.verifyPermission(), { email, code }).then(res => {
        dispatchAuthAction({
          type: 'VERIFY',
          payload: res.data
        })
        // console.log('res.data', res.data)
        return res.data;
      })
        .catch(err => console.log('err', err))
    }
    return verifyPermission()
  }

  const logoutFetch = () => {
    const logout = async () => {
      // return axios.get('/protected/auth/logout')
      return axios.get(server.logout()).then(_ => {
        logoutStorage();
        resetState();
        return true;
      }).catch(_ => false)
    }
    return logout()
  }

  const authContext = {
    authState,
    resetState,
    verifyPermission: verifyPermissionFetch,
    signup: signupFetch,
    signin: signinFetch,
    logout: logoutFetch,
    fetchUserDataByToken
  }

  return <AuthContext.Provider value={authContext}>
    {children}
  </AuthContext.Provider>
}

export default AuthProvider;

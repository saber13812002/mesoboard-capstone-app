import { useReducer } from 'react'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'
import axios from 'axios'
import { logoutStorage } from '../services/authService'
import { ServerRoutes as server } from '../services/apiService'

const AuthProvider = ({ children }) => {

  const initState = {
    userId: undefined,
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
      // console.log('-------------------------')
      // var email = req.body.email;
      // var password = req.body.password;
      // var gender = req.body.gender;
      // var first_name = req.body.first_name;
      // var last_name = req.body.last_name;
      // var user_type = "";
      userInfo['code'] = codeToRemove

      // return axios.post('/api/auth/signup', userInfo)
      return axios.post(server.signup(), userInfo)
        .then(res => {
          const { user_id, token } = res.data
          return verifyTokenAndGetUserInfoFetch(user_id, token, setRedirectToApp)
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
          // console.log('dispatch LOGIN', res.data)
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

  const verifyPermissionFetch = async (code) => {
    const verifyPermission = async () => {
      // console.log('code', code)
      //Will be modified to search for already created users
      axios.post(server.verifyPermission(), { code }).then(res => {
        dispatchAuthAction({
          type: 'VERIFY',
          payload: res.data
        })
      })
        .catch(err => console.log('err', err))
    }
    verifyPermission()
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

import { useReducer } from 'react'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'
import axios from 'axios'
import { logoutStorage, getToken } from '../services/authService'

const AuthProvider = ({ children }) => {
  const initState = {
    userId: undefined,
    firstName: '',
    lastName: '',
    email: '',
    // password: '',
    userType: '',
    gender: '',
  }
  const [authState, dispatchAuthAction] = useReducer(AuthReducer, initState)

  /** Reset this context state to its initial state */
  const resetState = () => dispatchAuthAction({ type: 'RESET', payload: initState })

  const fetchUserDataByToken = async () => {
    const getUserData = async () => {
      return axios.get('/protected/auth/userData')
        // return axios.get('/api/auth/user', { token: 'Bearer ' + getToken() })
        .then(res => {
          // const { user_id, token } = res.data.data
          dispatchAuthAction({
            type: 'SET_USER',
            // payload: { ...res.data },
            payload: res.data,
          })
          console.log('then', res)
          return res
        })
    }
    getUserData()
  }

  const signinFetch = async (userInfo, setRedirect) => {
    const { email, password } = userInfo;
    // console.log('signinFetch', email, password)
    const signin = async () => {
      return axios.post('/api/auth/login', { email, password })
        .then(async res => {
          const { user_id, token } = res.data.data
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

      return axios.post('/api/auth/signup', userInfo)
        .then(res => {
          const { user_id, token } = res.data.data
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
      return axios.post('/api/auth/verifyToken/getUser', { user_id, token })
        .then(res => {
          console.log('dispatch signin', res.data.data)
          dispatchAuthAction({
            type: 'LOGIN',
            payload: { ...res.data.data },
          })
          return setRedirectToApp
        })
        .then(_ => {
          console.log('setting redirect')
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
      console.log('code', code)
      axios.post('/api/permissions/verify', { code }).then(res => {
        console.log('res', res)
        dispatchAuthAction({
          type: 'VERIFY',
          payload: res.data.data
        })
      })
        .catch(err => console.log('err', err))
    }
    verifyPermission()
  }

  const logoutFetch = (setRedirect) => {
    const logout = async () => {
      const token = getToken()
      // return axios.get('/api/auth/logout', { headers: { 'token': 'Bearer ' + token})
      return axios.get('/protected/auth/logout')
        .then(_ => {
          logoutStorage()
          resetState()
          setRedirect(true) //maybe use history.push('/login') instead
        }).catch(err => {
          console.log('err', err)
          if (err.response.status)
            console.log('msg', err.response.status)
        })
    }
    logout()
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



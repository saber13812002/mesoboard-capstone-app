import React, { useState, useEffect, useContext } from 'react'
import './AuthWrapper.css'
import { Redirect, useLocation, Link } from 'react-router-dom'
// import { Form, Button } from 'react-bootstrap';

import MesoboardBackgroundImg from '../assets/mesoboard_background.jpg'
import { MesonLogo } from '../components'
import { AuthContext } from '../store'
import { Signin } from '../authentication'

const AuthWrapper = ({ children }) => {
  const [isTokenValid, setIsValidToken] = useState(false)
  const { state } = useLocation()
  const { token } = useContext(AuthContext)

  useEffect(() => {
    if (token)
      setIsValidToken(true)
  }, [token])

  if (isTokenValid) {
    return <Redirect to={state?.from || '/app/home'} />
  }

  // const handleSignin = (e) => {
  //   console.log('handleSignin')
  //   signin()
  //   e.preventDefault()
  // }

  // function doSomething(handler) {
  //   console.log("doSomething called by child with handler:", handler);
  // }

  // const childrenWithProps = React.Children.map(children, child => {
  //   // Checking isValidElement is safe
  //   if (React.isValidElement(child)) {
  //     return React.cloneElement(child, { doSomething });
  //   }
  //   return child;
  // });


  return (
    <div className='authWrapper'>
      <div className='authWrapper__left'>
        <div className='authWrapper__formContainer'>
          {children}
        </div>
      </div>

      {/* {childrenWithProps} */}
      <div className='authWrapper__right'>
        <img className='authWrapper__backImg' src={MesoboardBackgroundImg} />
        <Link to='/'>
          <MesonLogo className='authWrapper__logo' height={200} />
        </Link>
      </div>
    </div>
  )
}

export default AuthWrapper

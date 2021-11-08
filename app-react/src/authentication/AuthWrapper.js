import './AuthWrapper.css'
import { Redirect } from 'react-router-dom'

import MesoboardBackgroundImg from '../assets/mesoboard_background.jpg'
import { MesonLogo } from '../components'

const AuthWrapper = ({ children, redirectToApp }) => {
  console.log('redirectToApp', redirectToApp)

  return (
    <>
      {redirectToApp && <Redirect to={'/app/home'} />}
      {!redirectToApp && (
        <div className='authWrapper'>
          <div className='authWrapper__left'>
            <div className='authWrapper__formContainer'>
              {children}
            </div>
          </div>

          {/* {childrenWithProps} */}
          <div className='authWrapper__right'>
            <img className='authWrapper__backImg' src={MesoboardBackgroundImg} alt='background img' />
            <MesonLogo className='authWrapper__logo' height={200} />
          </div>
        </div>
      )}
    </>
  )
}

export default AuthWrapper

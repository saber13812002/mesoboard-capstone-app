import './Auth.css';
import { Redirect } from 'react-router-dom';

import MesoboardBackgroundImg from '../assets/mesoboard_background.jpg';
import { MesonLogo } from '../components';
import { urlPaths } from '../services/urlService';

const AuthWrapper = ({ children, redirectToApp }) => {
  return (
    <>
      {redirectToApp && <Redirect to={urlPaths.schedule} />}
      {!redirectToApp && (
        <div className='auth'>
          <div className='auth__left'>
            <div className='auth__formContainer'>
              {children}
            </div>
          </div>

          <div className='auth__right'>
            <img className='auth__backImg' src={MesoboardBackgroundImg} alt='background img' />
            <MesonLogo className='auth__logo' height={200} />
          </div>
        </div>
      )}
    </>
  )
}

export default AuthWrapper
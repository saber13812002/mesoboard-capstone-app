import './Auth.css';
import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import MesoboardBackgroundImg from '../assets/mesoboard_background.jpg';
import { MesonLogo } from '../components';
import { urlPaths } from '../services/urlService';
import { userTypes } from '../services/authService';
import { AuthContext } from '../store';

let redirectTo;

const AuthWrapper = ({ children, redirectToApp }) => {
  // console.log('redirectToApp', redirectToApp)
  const { authState, fetchUserDataByToken } = useContext(AuthContext);
  const { userType } = authState;
  const history = useHistory();

  useEffect(() => {
    // console.log('userType', userType)
    if (!userType) {
      if (redirectToApp)
        fetchUserDataByToken()
      return;
    }

    if (userType === userTypes.admin.value)
      redirectTo = urlPaths.profiles;
    else
      redirectTo = urlPaths.schedule;

    if (redirectToApp)
      history.push(redirectTo)

  }, [userType, redirectToApp])

  return (
    <>
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
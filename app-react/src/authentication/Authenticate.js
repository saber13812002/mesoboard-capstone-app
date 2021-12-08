import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthWrapper, Register } from '.';
import { AuthContext } from '../store';
import { isLoggedIn } from '../services/authService';
import { NavLink } from 'react-router-dom';
import { urlPaths } from '../services/urlService'

const minCodeLength = 6;

const Authenticate = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn());
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [verificationFetch, setVerificationFetch] = useState(undefined);
  const [userInfo, setUserInfo] = useState({});

  // context
  const { authState, verifyPermission, signup, resetState } = useContext(AuthContext);
  const { userType } = authState;

  // behaviours
  useEffect(() => {
    if (!verificationFetch) return;
    verifyPermission(email, code)
    setVerificationFetch(false);
  }, [verificationFetch]) // quizas funciona sin tener que usar verificatoinFetch

  useEffect(() => {
    if (Object.keys(userInfo).length === 0) return;

    signup(userInfo, code, setRedirectToApp);
  }, [userInfo])


  const handleCancel = (cachedEmail, cachedCode) => {
    resetState()
    setVerificationFetch(undefined)
    setCode(cachedCode)
    setEmail(cachedEmail)
    // maybe add a state and use it along with the userType in context 
    // to speed up the switch
  }

  const handleVerifyPermission = async (e) => {
    const email = e.target[0]?.value;
    const codeValue = e.target[1]?.value;
    console.log(email, codeValue);

    if (codeValue.length > 0 && email.includes('@')) {
      setVerificationFetch(true);
    }
    e.preventDefault()
  }

  const handleRegistration = (e, dataToRegister) => {
    console.log('dataToRegister', dataToRegister)
    // const { code, email, password, first_name, last_name, gender, phone, location, employee_id } = dataToRegister

    // data from outside the input forms
    // const gender = dataToRegister.gender;
    // const user_type = dataToRegister.userType;

    // const userForm = {
    //   code,
    //   email,
    //   password,
    //   first_name,
    //   last_name,
    //   gender,
    //   phone,
    //   location,
    //   employee_id,
    // }

    // // to register a manager - hardcoded
    // const userForm = {
    // email: authState.email,
    // location: authState.location,
    // employee_id: authState.employeeId,
    //   password: 'meso2021',
    //   gender: 'male',
    //   first_name: 'Manager',
    //   last_name: 'Entity',
    //   phone: '7874307478'
    // }

    // // to register an employee - hardcoded
    // const userForm = {
    //   email: authState.email,
    //   location: authState.location,
    //   employee_id: authState.employeeId,
    //   password: 'meso2021',
    //   gender: 'male',
    //   first_name: 'Kevin',
    //   last_name: 'Ramirez',
    //   phone: '7874307478'
    // }

    // console.log('userForm', userForm)
    if (dataToRegister)
      setUserInfo(dataToRegister);
    e.preventDefault()
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      {(userType.length === 0) && (
        <Form onSubmit={handleVerifyPermission}>
          <h2 style={{ color: '#287F4E' }}>Registración</h2>
          <Form.Control type='text' placeholder='Correo Electrónico'
            className='mt-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control type='text' placeholder='Código de verificación'
            className='mt-4'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button type='submit' variant='primary' className='w-100 mt-3' disabled={code.length < minCodeLength}>
            Verificar
          </Button>
        </Form>
      )}
      {(userType.length > 0) && (
        <Register
          userType={userType}
          cachedCode={code}
          cachedEmail={email}
          onCancel={handleCancel}
          onRegister={handleRegistration}
        />
      )}
      <p className='auth__redirect'>
        ¿Ya tienes una cuenta?
        <NavLink to={`${urlPaths.signin}`} className='ml-1' onClick={() => resetState()}>
          Iniciar
        </NavLink>
      </p>
    </AuthWrapper>
  )
}

export default Authenticate
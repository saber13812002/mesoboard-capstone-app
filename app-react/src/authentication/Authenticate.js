import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthWrapper, Register } from '.';
import { AuthContext } from '../store';
import { isLoggedIn } from '../services/authService';
import { NavLink } from 'react-router-dom';

const minCodeLength = 6;

const Authenticate = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn())
  const [code, setCode] = useState('')
  // const [code, setCode] = useState('654321')
  const [verificationFetch, setVerificationFetch] = useState(undefined)
  const [userInfo, setUserInfo] = useState({})

  // context
  const { authState, verifyPermission, signup, resetState } = useContext(AuthContext)
  const { userType } = authState

  // behaviours
  useEffect(() => {
    console.log('verificationFetch boolean', verificationFetch)
    if (verificationFetch !== undefined && verificationFetch) {
      console.log('about to fetch with code: ', code)
      verifyPermission(code)
      setVerificationFetch(false)
    }
  }, [verificationFetch]) // quizas funciona sin tener que usar verificatoinFetch

  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      signup(userInfo, code, setRedirectToApp)
    }
  }, [userInfo])


  const handleCancel = (cachedCode) => {
    resetState()
    setVerificationFetch(undefined)
    setCode(cachedCode)
    // maybe add a state and use it along with the userType in context 
    // to speed up the switch
  }

  const handleVerifyPermission = async (e) => {
    // console.log('handleVerifyPermission')
    const codeValue = e.target[0].value           //|| '654321' //for testing purposes
    console.log(codeValue.length)

    if (codeValue.length > 0) {
      setVerificationFetch(true)


      // setVerificationFetch(prev => (prev == undefined) ? true : !prev)

      // if (!verificationFetch) {
      //   setVerificationFetch(prev => (prev == undefined) ? true : !prev)
      // }
    }
    e.preventDefault()
  }

  const handleRegistration = (e) => {
    console.log('handleRegistration')
    // to register a manager - hardcoded
    // const userForm = {
    //   email: 'kevin.ramirez3@upr.edu',
    //   password: 'meso2021',
    //   gender: 'male',
    //   first_name: 'Kevin',
    //   last_name: 'Ramirez',
    // }

    // to register an employee - hardcoded
    const userForm = {
      email: 'employee@gmail.com', last_name: 'Entity',
      // email: 'employee2@gmail.com', last_name: 'Entity2',
      password: 'meso2021',
      gender: 'female',
      first_name: 'Employee',
    }
    if (userForm) {
      setUserInfo(userForm)
    }
    e.preventDefault()
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      {(userType.length === 0) && (
        <Form onSubmit={handleVerifyPermission}>
          <h2 style={{ color: '#287F4E' }}>Registración</h2>
          <Form.Control type='text' placeholder='Código de verificación'
            className='mt-4'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {/* <Form.Control type='text' placeholder='Correo electrónico' />
          <br /> */}

          {(code.length < minCodeLength) && <Button disabled className='w-100 mt-3'>Verificar</Button>}
          {(code.length >= minCodeLength) && (
            <Button type='submit' variant='primary' className='w-100 mt-3'>
              Verificar
            </Button>
          )}
        </Form>
      )}
      {(userType.length > 0) && (
        <Register
          userType={userType}
          cachedCode={code}
          onCancel={handleCancel}
          onRegister={handleRegistration}
        />
      )}
      <p className='auth__redirect'>
        ¿No tienes una cuenta?
        <NavLink to={'signin'} className='ml-1' onClick={() => resetState()}>
          Accesar
        </NavLink>
      </p>
    </AuthWrapper>
  )
}

export default Authenticate
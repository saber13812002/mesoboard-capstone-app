import { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'react-bootstrap';
import { AuthWrapper } from '.'
import { AuthContext } from '../store'
import { isLoggedIn } from '../services/authService'
import { NavLink } from 'react-router-dom'

const Authenticate = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn())
  const [code] = useState('provi_123456')
  const [verificationFetch, setVerificationFetch] = useState(undefined)
  const [userInfo, setUserInfo] = useState({})

  // context
  const { authState, verifyPermission, signup, resetState } = useContext(AuthContext)
  const { userType } = authState

  // behaviours
  useEffect(() => {
    if (verificationFetch != undefined)
      verifyPermission(code)
  }, [verificationFetch])

  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      signup(userInfo, code, setRedirectToApp)
    }
  }, [userInfo])

  const handleVerifyPermission = async (e) => {
    // console.log('e.target', e.target[0].value)
    if (code) {
      setVerificationFetch(prev => (prev == undefined) ? true : !prev)
    }
    e.preventDefault()
  }

  const handleRegistration = (e) => {
    // var email = req.body.email;
    // var password = req.body.password;
    // var gender = req.body.gender;
    // var first_name = req.body.first_name;
    // var last_name = req.body.last_name;

    const userForm = {
      email: 'kevin.ramirez3@upr.edu',
      password: 'meso2021',
      gender: 'male',
      first_name: 'Kevin',
      last_name: 'Ramirez',
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
          <br />
          <Form.Control type='text' placeholder='Código de verificación' />
          <br />
          {/* <Form.Control type='text' placeholder='Correo electrónico' />
          <br /> */}
          <Button type='submit' variant='primary' className='w-100'>
            Verificar
          </Button>
        </Form>
      )}
      {(userType.length > 0) &&
        <>
          <h2 style={{ color: '#287F4E', textAlign: 'center' }}>Registrando como {userType}</h2>
          <Form onSubmit={handleRegistration}>
            {/* <span>{userType}</span> */}
            <br />
            <Form.Control size='sm' type='text' placeholder='Nombre' />
            <br />
            <Form.Control size='sm' type='text' placeholder='Apellido' />
            <br />
            <Form.Control size='sm' type='text' placeholder='Correo electrónico' />
            <br />
            <Form.Control size='sm' type='number' placeholder='# celular' />
            <br />
            <Form.Control size='sm' type='password' placeholder='Contraseña' />
            <br />
            <Form.Control size='sm' type='password' placeholder='Confirmar Contraseña' />
            <br />
            <Button type='submit' variant='primary' className='w-100'>
              Registrarse
            </Button>
          </Form>
        </>
      }
      <p className='auth__redirect'>
        ¿Ya tienes una cuenta?
        <NavLink to={'signin'} onClick={() => resetState()}>
          Accesar
        </NavLink>
      </p>
    </AuthWrapper>
  )
}

export default Authenticate

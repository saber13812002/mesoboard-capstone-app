import { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'react-bootstrap';
import { AuthWrapper } from '.'
import { AuthContext } from '../store'
import { isLoggedIn } from '../services/authService'


const Authenticate = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn())
  const [code] = useState('provi_123456')
  const [verificationFetch, setVerificationFetch] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  // context
  const { authState, verifyPermission, signup } = useContext(AuthContext)
  const { userType } = authState

  // behaviours
  useEffect(() => {
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
      setVerificationFetch(prev => !prev)
      // setVerificationFetch(true)
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
      {(userType.length > 0) && (
        <Form onSubmit={handleRegistration}>
          <h2 style={{ color: '#287F4E' }}>Registrando como {userType}</h2>
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
            Register
          </Button>
        </Form>
      )}
    </AuthWrapper>
  )
}

export default Authenticate

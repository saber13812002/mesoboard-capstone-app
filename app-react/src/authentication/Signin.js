import './Auth.css';
import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../store'
import { AuthWrapper } from '.';
import { isLoggedIn } from '../services/authService';
import { NavLink } from 'react-router-dom';

const Signin = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn());
  const { signin } = useContext(AuthContext);

  const handleSignin = (e) => {
    const email = e.target[0].value;
    const password = e.target[1].value;
    // const email= 'manager@gmail.com';
    // const password = 'meso2021';
    if (!email || !password) {
      e.preventDefault();
      return;
    }
    signin({ email, password }, setRedirectToApp);
    e.preventDefault();
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      <h2 style={{ color: '#287F4E', textAlign: 'center' }}>Iniciar Sesión</h2>
      <Form onSubmit={handleSignin}>
        <Form.Control className='mt-4' type='text' placeholder='Correo electrónico' />
        <Form.Control className='mt-3' type='text' placeholder='Contraseña' />
        <Button type='submit' variant='primary' className='w-100 mt-3'>
          Iniciar
        </Button>
      </Form>
      <p className='auth__redirect auth__resetPassword'>
        <NavLink to={'forgot-password'}>
          ¿Olvidó su contraseña?
        </NavLink>
      </p>
      <p className='auth__redirect'>
        <NavLink to={'authenticate'}>
          Registrarse
        </NavLink>
      </p>
    </AuthWrapper>
  )
}

export default Signin
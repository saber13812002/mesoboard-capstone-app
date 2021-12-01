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
  const [email] = useState('kevin.ramirez3@upr.edu');
  // const [email] = useState('employee@gmail.com');
  const [password] = useState('meso2021');

  const handleSignin = (e) => {
    signin({ email, password }, setRedirectToApp);
    e.preventDefault();
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      <h2 style={{ color: '#287F4E', textAlign: 'center' }}>Iniciar Sesión</h2>
      <Form onSubmit={handleSignin}>
        <Form.Control className='mt-4' size="lg" type="text" placeholder="Correo electrónico" />
        <Form.Control className='mt-3' size="lg" type="text" placeholder="Contraseña" />
        <Button type="submit" variant="primary" className="w-100 mt-3">
          Iniciar
        </Button>
      </Form>
      <p className='auth__redirect auth__resetPassword'>
        <NavLink to={'forgot-password'}>
          ¿Olvidó su contraseña?
        </NavLink>
      </p>
      <p className='auth__redirect'>
        {/* ¿No tienes una cuenta? */}
        {/* <NavLink to={'authenticate'} className='ml-2'> */}
        <NavLink to={'authenticate'}>
          Registrase
        </NavLink>
      </p>
    </AuthWrapper>
  )
}

export default Signin
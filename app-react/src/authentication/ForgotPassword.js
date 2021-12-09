import './Auth.css';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { AuthWrapper } from '.';
import { isLoggedIn } from '../services/authService';
import { urlPaths } from '../services/urlService';
import { useHistory } from 'react-router-dom';
import { ServerRoutes as server } from '../services/apiService';
import { MButton, iconComponents } from '../components';
import axios from 'axios';

const ForgotPassword = () => {
  const history = useHistory();
  const [redirectToApp] = useState(isLoggedIn());
  const [emailToSend, setEmailToSend] = useState(undefined)

  useEffect(() => {
    if (!emailToSend) return;
    axios.post(server.sendResetPassword(), { email: emailToSend })
    setEmailToSend(undefined);
    handleCancel();
  }, [emailToSend])

  const handleCancel = () => history.push(`${urlPaths.signin}`)

  const sendResetPassword = (e) => {
    const email = e.target[0]?.value;
    console.log('email', email)
    setEmailToSend(email)
    e.preventDefault();
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      <h2 style={{ color: '#287F4E', textAlign: 'center' }}>Recuperar Contraseña</h2>
      <Form onSubmit={sendResetPassword}>
        <Form.Control className='mt-4' size='lg' type='text' placeholder='Correo electrónico' />
        <div className='d-flex w-100 justify-content-between mt-3 gap-3'>
          <MButton
            className='w-100'
            text='Cancelar'
            variant='light'
            onClick={handleCancel}
          />
          <MButton
            type='submit'
            className='w-100'
            text='Enviar'
            variant='primary'
            IconComponent={iconComponents.Mail}
            iconSize='sm'
          />
        </div>
      </Form>
    </AuthWrapper>
  )
}

export default ForgotPassword
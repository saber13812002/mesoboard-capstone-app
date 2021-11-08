import { useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../store'
import { AuthWrapper } from '.';
import { isLoggedIn } from '../services/authService'

const Signin = () => {
  const [redirectToApp, setRedirectToApp] = useState(isLoggedIn())
  const { signin } = useContext(AuthContext)
  const [email] = useState('kevin.ramirez3@upr.edu')
  const [password] = useState('meso2021')

  const handleSignin = (e) => {
    signin({ email, password }, setRedirectToApp)
    e.preventDefault()
  }

  return (
    <AuthWrapper redirectToApp={redirectToApp}>
      <Form onSubmit={handleSignin}>
        <h2 style={{ color: '#287F4E' }}>Iniciar Sesión</h2>
        <br />
        <Form.Control size="lg" type="text" placeholder="Correo electrónico" />
        <br />
        <Form.Control size="lg" type="text" placeholder="Contraseña" />
        <br />
        <Button type="submit" variant="primary" className="w-100">
          Iniciar
        </Button>
      </Form>
    </AuthWrapper>
  )
}

export default Signin
import { useContext } from 'react'
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../store'
import { AuthWrapper } from '.';

const Signin = () => {
  const { signin } = useContext(AuthContext)

  const handleSignin = (e) => {
    signin()
    e.preventDefault()
  }

  return (
    <AuthWrapper>
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
import { useContext } from 'react'
import { Form, Button } from 'react-bootstrap';
import { AuthWrapper } from '.'
import { AuthContext } from '../store'

const VerifyPermission = () => {
  const { verifyPermission } = useContext(AuthContext)

  const handleVerifyPermission = (e) => {
    verifyPermission()
    e.preventDefault()
  }

  return (
    <AuthWrapper>
      <Form onSubmit={handleVerifyPermission}>
        <h2 style={{ color: '#287F4E' }}>Verificar Permiso</h2>
        <br />
        <Form.Control size="lg" type="text" placeholder="Correo electrónico" />
        <br />
        <Button type="submit" variant="primary" className="w-100">
          Verificar
        </Button>
      </Form>
    </AuthWrapper>
  )
}

export default VerifyPermission

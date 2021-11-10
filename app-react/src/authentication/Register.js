import { Form, Button } from 'react-bootstrap';

const Register = ({ userType, cachedCode, onCancel, onRegister }) => {

  return (
    <>
      <h2 style={{ color: '#287F4E', textAlign: 'center' }}>Registrando como {userType}</h2>
      <Form onSubmit={onRegister}>
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
        <div className='d-flex justify-content-between w-100'>
          <Button onClick={() => onCancel(cachedCode)} variant='light' className='w-100 mr-3'>
            Cancel
          </Button>
          <Button type='submit' variant='primary' className='w-100'>
            Registrarse
          </Button>
        </div>
      </Form>
    </>
  )
}

export default Register

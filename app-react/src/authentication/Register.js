import { useState, useEffect, useContext } from 'react';
import { Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { userTypes, genders } from '../services/authService';
import { AuthContext } from '../store';

const Register = ({ cachedEmail, cachedCode, onCancel, onRegister }) => {
  const [isDataValid, setIsDataValid] = useState(false);

  // input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // dropdown states
  const [selectedGender, setSelectedGender] = useState({ label: 'Género' });

  const { authState } = useContext(AuthContext);
  const { userType, location, email, employeeId } = authState;
  // console.log('authState', authState);


  useEffect(() => {
    handleChange();
  }, [firstName, lastName, phone, password, confirmPassword])


  const handleChange = () => {
    // data from dropdown fields
    const gender = selectedGender['value'];
    const isValid = firstName && lastName && (phone && phone.length > 9) && gender && password && confirmPassword && password === confirmPassword && true;
    setIsDataValid(isValid);
  }


  const handleSelectedGender = id =>
    setSelectedGender(genders.find(g => g.id === Number(id)))

  const allDataToRegister = () => {
    return {
      email,
      location,
      employee_id: employeeId,
      first_name: firstName,
      last_name: lastName,
      phone,
      password,
      user_type: userType,
      gender: selectedGender['value'],
      code: cachedCode
    }
  }

  return (
    <>
      <div className='register__headers text-center'>
        <p className='userType'>Registrando como {userTypes[userType].label}</p>
        {location && <p className='restaurant'>{`'${location}'`}</p>}
        <p className='employeeId'>{`ID - ${employeeId}`}</p>
      </div>
      <Form onSubmit={e => onRegister(e, allDataToRegister())} className='register__forms'>
        <Form.Control size='sm' type='text' value={email} disabled />
        <Form.Control size='sm' type='text' placeholder='Nombre' onChange={e => setFirstName(e.target.value)} />
        <Form.Control size='sm' type='text' placeholder='Apellidos' onChange={e => setLastName(e.target.value)} />
        <Form.Control size='sm' type='number' placeholder='# Telefónico' onChange={e => setPhone(e.target.value)} onWheel={(e) => e.target.blur()} />
        <DropdownButton
          title={
            <span style={{ color: (selectedGender.label !== 'Género') ? 'black' : '' }}>
              {selectedGender.label}
            </span>
          }
          onSelect={handleSelectedGender}
        >
          {genders.map((g, i) =>
            <Dropdown.Item key={g.id} eventKey={g.id}>
              {g.label}
            </Dropdown.Item>
          )}
        </DropdownButton>
        <Form.Control size='sm' type='password' placeholder='Contraseña' onChange={e => setPassword(e.target.value)} />
        <Form.Control size='sm' type='password' placeholder='Confirmar Contraseña' onChange={e => setConfirmPassword(e.target.value)} />
        <br />
        <div className='d-flex justify-content-between w-100'>
          <Button onClick={() => onCancel(cachedEmail, cachedCode)} variant='light' className='w-100 mr-3'>
            Cancel
          </Button>
          <Button type='submit' variant='primary' className='w-100' disabled={!isDataValid}>
            Registrarse
          </Button>
        </div>
      </Form>
    </>
  )
}

export default Register

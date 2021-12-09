import './AddPermission.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MButton } from '../../../components';
import { Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { ServerRoutes as server } from '../../../services/apiService';
import { userTypes, truncateLocation } from '../../../services/authService';
import { AuthContext } from '../../../store';


const permissionTypes = [
  {
    id: 0,
    label: userTypes.employee.label,
    value: userTypes.employee.value
  },
  {
    id: 1,
    label: userTypes.manager.label,
    value: userTypes.manager.value
  }
];

const initialRestaurantObj = { location: 'Restaurante' };

const AddPermission = ({ onBack, restaurants }) => {
  const [isDataValid, setIsDataValid] = useState(false);

  // context
  const { authState } = useContext(AuthContext);
  const { userType, location } = authState;
  const isManager = (userType === userTypes.manager.value);

  // input states
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [tempCode, setTempCode] = useState('');
  const [isAssistantManager, setIsAssistantManager] = useState(false);

  console.log('userType', userType)
  console.log('userTypes.manager.label', userTypes.manager.label)

  // dropdown states
  const [selectedRestaurant, setSelectedRestaurant] = useState(isManager ? { location } : initialRestaurantObj);
  const [selectedPermissionType, setSelectedPermissionType] = useState({ label: userTypes.employee.label, value: userTypes.employee.value });
  console.log('authState', authState);

  useEffect(() => {
    if (userType === userTypes.admin.value) {
      permissionTypes.push({
        id: 2,
        label: userTypes.admin.label,
        value: userTypes.admin.value
      })
    }
  }, [])

  useEffect(() => {
    handleChange();
  }, [email, employeeId, tempCode, selectedRestaurant, selectedPermissionType, isAssistantManager])


  const handlePermissionType = id => {
    const permissionType = permissionTypes.find(r => r.id === Number(id));
    if (permissionType.value === userTypes.admin.value)
      setSelectedRestaurant(initialRestaurantObj); //reset restaurant id validation
    setSelectedPermissionType(permissionType);
  }

  const handleSelectedRestaurant = id =>
    setSelectedRestaurant(restaurants.find(r => r.restaurant_id === Number(id)))

  const handleChange = () => {
    // data from dropdown fields
    const permission_type = selectedPermissionType['value'];
    const restaurant_id = selectedRestaurant['restaurant_id'];
    // console.log('--', email, employeeId, tempCode, permission_type, restaurant_id);

    // const isValid = email && email.includes('@') && employeeId && tempCode.length >= 6 && permission_type && restaurant_id && true;
    let isValid = email && email.includes('@') && employeeId && tempCode.length >= 6 && permission_type && true;
    if (permission_type !== userTypes.admin.value) {
      isValid = isValid && restaurant_id
    }

    setIsDataValid(isValid);
  }


  const addPermission = async (e) => {
    // console.log('e', e)
    // console.log('e.target', e.target[0].value)
    let email = e.target[0]?.value;
    let employee_id = e.target[1]?.value;
    let tempCode = e.target[2]?.value;

    // data from dropdown fields
    let permission_type = selectedPermissionType['value'];
    let restaurant_id = selectedRestaurant['restaurant_id'];
    // console.log('permission_type', permission_type)
    // console.log('tempCode', tempCode)
    // console.log('restaurant_id', restaurant_id)


    const addPermissionFetch = async () => {
      // console.log('addPermissionFetch')
      axios.post(server.addPermission(), { email, permission_type, code: tempCode, restaurant_id, employee_id, is_assistant_manager: isAssistantManager })
    }
    addPermissionFetch();
    setTimeout(() => onBack(), 900)
    e.preventDefault();
  }

  return (
    <div className='addPermission__card card pb-3' >
      <header className='d-flex justify-content-start align-items-center p-3 title bg-light-gray'>
        <h6 className='m-0'>Agregar nuevo permiso</h6>
      </header>

      <Form className='addPermission__form' onSubmit={addPermission} onChange={handleChange}>
        <br />
        <Form.Control type='text' placeholder='Correo electrónico' required onChange={(e) => setEmail(e.target.value)} />
        <Form.Control type='text' placeholder='Número de empleado' className='mt-3' required onChange={(e) => setEmployeeId(e.target.value)} />
        <Form.Control type='text' placeholder='Código Temporero (6+)' className='mt-3' required onChange={(e) => setTempCode(e.target.value)} />

        {/*  DROPDOWNS */}
        <DropdownButton
          title={<span style={{ color: 'black' }} > {selectedPermissionType.label}</span>}
          className='pt-3 pb-3'
          onSelect={handlePermissionType}
        >
          {permissionTypes.map(permissionType =>
            <Dropdown.Item key={permissionType.value} eventKey={permissionType.id}>
              {permissionType.label}
            </Dropdown.Item>
          )}
        </DropdownButton>

        {(selectedPermissionType.value === userTypes.manager.value || selectedPermissionType.value === userTypes.employee.value) && (
          <DropdownButton
            title={
              <span style={{ color: (selectedRestaurant.location !== initialRestaurantObj.location) ? 'black' : '' }}>
                {truncateLocation(selectedRestaurant?.location)}
              </span>}
            className='restaurant mb-3'
            onSelect={handleSelectedRestaurant}
            disabled={isManager}
          >
            {restaurants.map(r =>
              <Dropdown.Item key={r.restaurant_id} eventKey={r.restaurant_id}>
                {r.location}
              </Dropdown.Item>
            )}
          </DropdownButton>
        )}

        {(selectedPermissionType.value === userTypes.manager.value) && (
          <label className='mb-3'>
            <input type="checkbox" onClick={(e) => setIsAssistantManager(e.target.checked)} />
            <span className='ml-1'>¿Es supervisor asistente?</span>
          </label>
        )}

        <div className='d-flex justify-content-between w-100 gap-3'>
          <MButton
            text='Cancelar'
            onClick={onBack}
            className='w-75'
            variant='light'
          />
          <MButton
            type='submit'
            text='Añadir Permiso'
            variant='primary'
            className='w-100'
            disabled={!isDataValid}
          />
        </div>
      </Form>
    </div>
  )
}

export default AddPermission

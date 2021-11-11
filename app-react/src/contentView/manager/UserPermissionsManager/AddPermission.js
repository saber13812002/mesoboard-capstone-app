import { useState } from 'react'
import './AddPermission.css'
import { Icon, ICON_OPTIONS, MButton } from '../../../components'
import { Form, Dropdown, DropdownButton } from 'react-bootstrap'
import axios from 'axios'

const AddPermission = ({ onBack }) => {
  const [selectedPermissionType, setSelectedPermissionType] = useState({ label: 'Employee', value: 'employee' });
  // const [selectedUserType, setSelectedUserType] = useState({ label: 'Administrator', value: 'admin' });

  const permissionTypes = [
    {
      id: 0,
      label: 'Employee',
      value: 'employee',
    },
    {
      id: 1,
      label: 'Manager',
      value: 'manager',
    },
    {
      id: 2,
      label: 'Administrator',
      value: 'admin',
    },
  ];
  // const permissionTypes = [];

  const addPermission = async (e) => {
    console.log('e', e)
    console.log('e.target', e.target[0].value)
    let email = e.target[0]?.value
    let code = e.target[1]?.value
    const permission_type = selectedPermissionType.value
    if (!email) { //don't want to write on testing
      email = 'employee@gmail.com'
    }
    if (!code) {
      code = '654321'
    }
    console.log('email', email)
    console.log('code', code)
    console.log('permissionType', selectedPermissionType.value)


    const addPermissionFetch = async () => {
      // console.log('code', code)
      axios.post('protected/permissions/add', { email, permission_type, code }).then(res => {
        console.log('res', res.data)
      })
        .catch(err => console.log('err', err))
      // axios.post('api/permissions/verify', { code }).then(res => {
      //   console.log('res', res)
      //   dispatchAuthAction({
      //     type: 'VERIFY',
      //     payload: res.data.data
      //   })
      // })
      //   .catch(err => console.log('err', err))
    }
    addPermissionFetch()

    e.preventDefault()
  }


  const handleSelect = (id) => {
    const permissionType = permissionTypes.find(r => r.id == id)
    setSelectedPermissionType(permissionType)
  }

  return (
    <>
      {/* <div className='dark-gray circular-btn d-flex justify-content-start align-items-center mb-3' onClick={onBack}>
        <Icon icon={ICON_OPTIONS.angleLeft} />
        BACK
      </div> */}

      <div className='addPermission__card card pb-3' >
        <div className='d-flex justify-content-start align-items-center p-3 title bg-light-gray'>
          <h6 className='m-0'>Agregar nuevo permiso</h6>
        </div>

        <Form className='addPermission__form' onSubmit={addPermission}>
          <br />
          <Form.Control type='text' placeholder='Correo electrónico' />
          <Form.Control type='text' placeholder='Código de empleado' className='mt-3' />
          <DropdownButton
            title={<span>{selectedPermissionType.label}</span>}
            className='pt-3 pb-3'
            onSelect={handleSelect}
          >
            {permissionTypes.map(permissionType =>
              <Dropdown.Item key={permissionType.value} eventKey={permissionType.id}>
                {permissionType.label}
              </Dropdown.Item>
            )}
          </DropdownButton>

          <div className='d-flex justify-content-start w-100'>
            <MButton
              onClick={onBack}
              className='mr-3'
              text='Cancelar'
              variant='light'
              size='sm'
            />
            <MButton
              type='submit'
              icon={ICON_OPTIONS.plus}
              text='Añadir Permiso'
              variant='primary'
              size='sm'
            />
          </div>
        </Form>
      </div>
    </>
  )
}

export default AddPermission

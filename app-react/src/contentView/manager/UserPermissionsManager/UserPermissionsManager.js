import { useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import './UserPermissionsManager.css';
import { iconComponents, MButton } from '../../../components'
import { AddPermission } from '../../'


const profiles = [{
  employeeName: 'J. Ramírez, Iris',
  email: 'iris.ramirez@gmail.com',
  creationDate: '8/22/2021',
  userType: 'employee'
}, {
  employeeName: 'D. Ocasio, Iván',
  email: 'ivan.ocasio@gmail.com',
  creationDate: '8/24/2021',
  userType: 'employee'
}]

const columns = [{
  dataField: 'employeeName',
  text: 'Employee',
  sort: true
}, {
  dataField: 'email',
  text: 'Email'
}, {
  dataField: 'creationDate',
  text: 'Fecha de creación',
  sort: true
}, {
  dataField: 'userType',
  text: 'Tipo de usuario'
}];



const UserPermissionsManager = () => {
  const [addingNewPermission, setAddingNewPermission] = useState(false);
  console.log('UserPermissionsManager')

  const handleBack = () => {
    setAddingNewPermission(false)
  }

  const handleAddNewPermission = () => {
    setAddingNewPermission(true)
  }

  return (
    <>
      {!addingNewPermission && <div className='userPermissionsManager'>
        <BootstrapTable responsive bootstrap4 bordered={false} keyField='email' data={profiles} columns={columns} />
        <div style={{ marginTop: '-40px' }}>
          <MButton
            onClick={handleAddNewPermission}
            IconComponent={iconComponents.Plus}
            iconSize='sm'
            text='Nuevo Permiso'
            variant='primary'
            size='sm'
            className='ml-4'
          />
        </div>
      </div>}
      {addingNewPermission && <AddPermission onBack={handleBack} />}
    </>
  )
}

export default UserPermissionsManager

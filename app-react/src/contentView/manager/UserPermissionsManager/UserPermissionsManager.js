import { useState, useEffect } from 'react'
import './UserPermissionsManager.css';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { iconComponents, MButton } from '../../../components';
import { AddPermission } from '../../';
import { ServerRoutes as server } from '../../../services/apiService';

const columns = [{
  dataField: 'name',
  text: 'Usuario',
  sort: true
}, {
  dataField: 'email',
  text: 'Correo Electronico'
}, {
  dataField: 'creation_date',
  text: 'Fecha de creación',
  sort: true,
  // formatter: (cell, row) => types[cell]
}, {
  dataField: 'user_type',
  text: 'Tipo de usuario',
  sort: true,
}];



const UserPermissionsManager = () => {
  const [addingNewPermission, setAddingNewPermission] = useState(false);
  const [employees, setEmployees] = useState([]);
  console.log('UserPermissionsManager');

  useEffect(() => {
    console.log('useEffect')
    const getAllEmployees = () => {
      axios.get(server.getAllEmployees()).then(res => {
        console.log('res.data.employees', res.data.employees)
        setEmployees(res.data.employees)
      })
    }
    getAllEmployees()
  }, [])

  const handleBack = () => {
    setAddingNewPermission(false)
  }

  const handleAddNewPermission = () => {
    setAddingNewPermission(true)
  }

  return (
    <>
      {!addingNewPermission && <div className='userPermissionsManager'>
        <BootstrapTable responsive bootstrap4 bordered={false} keyField='email' data={employees} columns={columns} />
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

import { useState, useEffect } from 'react'
import './UserPermissionsManager.css';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { iconComponents, MButton } from '../../../components';
import { AddPermission, EntityDetails } from '../..';
import { ServerRoutes as server } from '../../../services/apiService';
import { beautifyDate } from '../../../services/scheduleService';


let columns = [];

const UserPermissionsManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [addingNewPermission, setAddingNewPermission] = useState(false);
  const [users, setUsers] = useState([]);
  const [details, setDetails] = useState({});

  useEffect(() => {
    columns = [{
      dataField: 'name',
      text: 'Nombre',
      sort: true,
      classes: 'nameTd',
      formatter: (name, data) => {
        // console.log('data', data);
        if (data.creation_date)
          return <>{name && <p className='name' onClick={() => setDetails(data)}>{name}</p>}</>
        else if (data.last_update)
          return <p className='name permissionName'>{'N/A'}</p>
      }

    }, {
      dataField: 'email',
      text: 'Correo Electronico'
    }, {
      dataField: 'creation_date',
      text: 'Fecha de creación',
      sort: true,
      formatter: (date) => beautifyDate(date),
    }, {
      dataField: 'user_type',
      text: 'Tipo de usuario',
      sort: true,
    }];

    axios.get(server.getAllUsersAndPermissions()).then(res => {
      console.log('res.data.data', res.data.data)
      setUsers(res.data.data)
    })

    axios.get(server.getAllRestaurants()).then(res => {
      console.log('res.data', res.data.restaurants)
      setRestaurants(res.data.restaurants)
    })
  }, [addingNewPermission])


  const defaultSorted = [{
    dataField: 'user_type', // if dataField is not match to any column you defined, it will be ignored.
    order: 'desc' // desc or asc
  }];


  return (
    <>
      {(Object.keys(details).length > 0 && restaurants.length > 0) ?
        <EntityDetails details={details} onBack={() => setDetails({})} />
        : <>
          {addingNewPermission && <AddPermission onBack={() => setAddingNewPermission(false)} restaurants={restaurants} />}
          {!addingNewPermission && (<>
            {(users.length > 0) &&
              <div className='userPermissionsManager'>
                <BootstrapTable responsive bootstrap4 bordered={false} keyField='email'
                  defaultSorted={defaultSorted}
                  data={users}
                  columns={columns}
                />
                <div style={{ marginTop: '-40px' }}>
                  <MButton
                    onClick={() => setAddingNewPermission(true)}
                    IconComponent={iconComponents.Plus}
                    iconSize='sm'
                    text='Nuevo Permiso'
                    variant='primary'
                    size='sm'
                    className='ml-4'
                  />
                </div>
              </div>}
          </>)}
        </>}
    </>
  )
}

export default UserPermissionsManager

import { useEffect, useContext } from 'react';
import { AuthContext } from '../../../store';



const Profile = () => {

    const { firstName, lastName, employeeId, location, gender, userType, email } = authState;
    console.log('authState', authState)
    const { authState } = useContext(AuthContext);



  return (
    <div className='profile'>
      <div className='dc_container'>
            <h6 className = 'title'>email</h6>
            <h5>{email}</h5> 
            
            <h6 className= 'title'>Restaurante</h6>
            <h5>{location}</h5>
        </div>
        <div className='dc_container2'>
            <h6 className= 'title'>Género</h6>
            <h5>{gender}</h5>

            <h6 className= 'title'>ID</h6>
            <h5>{employeeId}</h5>

            <h6 className= 'title'>Tipo de Usuario</h6>
            <h5>{userType}</h5>
        </div>
    </div>
  )
}

export default Profile

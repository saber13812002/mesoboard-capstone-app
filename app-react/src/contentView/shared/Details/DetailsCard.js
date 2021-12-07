import './DetailsCard.css';
import { useContext } from 'react';
import { AuthContext } from '../../../store';
import { userTypes } from '../../../services/authService';


const genders = {
  male: {
    label: 'Masculino',
    value: 'male',
  },
  female: {
    label: 'Fémina',
    value: 'female',
  },
  pnr: {
    label: 'Prefiero no revelar',
    value: 'pnr',
  },
  other: {
    label: 'Otro',
    value: 'Otro',
  }
}


const DetailsCard = () => {
  const { authState } = useContext(AuthContext);
  const { firstName, lastName, employeeId, location, gender, userType, email } = authState;
  console.log(genders)
  console.log(gender)
  console.log('userTypes', userTypes)

  return (
    <div>
      <div className='scheduleDetails__profileInfo mb-3 p-3'>
        <h4>{firstName} {lastName}</h4>
        <div className='dc_container'>
          <h6 className='title'>email</h6>
          <h5>{email}</h5>

          <h6 className='title'>Restaurante</h6>
          <h5>{location}</h5>
        </div>
        <div className='dc_container2'>
          <h6 className='title'>Género</h6>
          <h5>{genders[gender].label}</h5>

          <h6 className='title'>ID</h6>
          <h5>{employeeId}</h5>

          <h6 className='title'>Tipo de Usuario</h6>
          <h5>{userTypes[userType].label}</h5>
        </div>
      </div>
    </div>
  )
}

export default DetailsCard

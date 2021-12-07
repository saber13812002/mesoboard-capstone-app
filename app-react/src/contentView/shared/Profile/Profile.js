import { useContext } from 'react';
import { AuthContext } from '../../../store';
import { DetailsCard } from '../..';

const Profile = () => {
  return (
    <div className='profile'>
      <DetailsCard />
    </div>
  )
}

export default Profile

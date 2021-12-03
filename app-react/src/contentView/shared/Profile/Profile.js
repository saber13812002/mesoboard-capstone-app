import { useEffect, useContext } from 'react';
import { AuthContext } from '../../../store';



const Profile = () => {
  const { authState } = useContext(AuthContext);
  console.log('authState', authState)

  const userInfoUsedOnProfile = [
    'first_name',
    'last_name',
    'gender',
    'email',
    'user_type',
    // the once not implemented yet
    'restaurant',
    'id' //not userId
  ]

  return (
    <div className='profile'>
      {/* remove this */}
      <ul>
        {userInfoUsedOnProfile.map(userInfo => <li key={userInfo}>{userInfo}</li>)}
      </ul>
    </div>
  )
}

export default Profile

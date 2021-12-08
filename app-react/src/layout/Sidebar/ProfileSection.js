import { useState, useContext } from 'react';
import './ProfileSection.css';
import { Icon, iconComponents } from '../../components';
import { AuthContext } from '../../store';
import { ProfileCard } from '..';
import { truncateLocation } from '../../services/authService';

const ProfileSection = ({ profileNameEl, onLogout }) => {
  const [profileCardDimensions, setProfileCardDimensions] = useState({});
  const { authState } = useContext(AuthContext);
  const { firstName, lastName, employeeId, location } = authState;

  /**
   * Display a card with at least the profile and logout items
   * with the use of useRef hook
   */
  const showProfileCard = () => {
    setProfileCardDimensions({
      top: profileNameEl.current.offsetTop + profileNameEl.current.offsetHeight,
      left: profileNameEl.current.offsetLeft,
      width: profileNameEl.current.offsetWidth
    });
  }

  const handlePressingProfileSection = () => {
    const isAlreadyOpen = Object.keys(profileCardDimensions).length > 0
    if (isAlreadyOpen) {
      setProfileCardDimensions({});
    }
  }

  return (
    <div className='profileSection' onMouseLeave={() => setProfileCardDimensions({})} >
      {Object.keys(profileCardDimensions).length > 0 && (
        <ProfileCard cardDimensions={profileCardDimensions} onLogout={onLogout} onHideCard={() => setProfileCardDimensions({})} />
      )}
      <p className='welcome'>Bienvenido{firstName && <>,</>}</p>
      <div className='profileSection__clickableName'
        ref={profileNameEl}
        onMouseEnter={showProfileCard}
        onClick={handlePressingProfileSection}
      >
        {firstName && <>
          <p>{firstName} {lastName}</p>
          <div className='profileSection__icon'>
            <Icon
              IconComponent={iconComponents.CaretDown}
              size='sm'
              color='dark'
              className='mt-1'
            />
          </div>
        </>}
      </div>
      {employeeId && (
        <p>ID: {employeeId}</p>
      )}
      {location && (
        <p>{truncateLocation(location)}</p>
      )}
    </div>
  )
}

export default ProfileSection
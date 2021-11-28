import { Icon, iconComponents } from '../../components';
import './ProfileCard.css';

const ProfileCard = ({ profileCardDimensions, onHideCard, onLogout }) => {
  // console.log('profileCardDimensions', profileCardDimensions);
  const cardItems = [{
    IconComponent: iconComponents.Person,
    text: 'Profile',
  }, {
    IconComponent: iconComponents.Logout,
    text: 'Logout',
    onClick: onLogout
  }]

  return (
    <div
      className='profileCard'
      style={{ top: profileCardDimensions.top + 'px', left: profileCardDimensions.left + 'px', width: profileCardDimensions.width + 'px' }}
      onMouseLeave={onHideCard}
    >
      <div className='card'>
        {cardItems.map(({ IconComponent, text, onClick }) => {
          return (
            <div key={text} className='cardItemContainer' onClick={onClick}>
              <div className='cardItem'>
                <Icon
                  IconComponent={IconComponent}
                  color='dark'
                  size='sm'
                />
                <span>{text}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileCard

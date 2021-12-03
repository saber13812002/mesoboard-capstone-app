import { Icon, iconComponents } from '../../components';
import './ProfileCard.css';
import { useHistory } from 'react-router-dom';
import { urlPaths } from '../../services/urlService';

const ProfileCard = ({ profileCardDimensions, onHideCard, onLogout }) => {
  const history = useHistory()
  const redirectToProfile = () => history.push(urlPaths.profile)

  const cardItems = [{
    IconComponent: iconComponents.Person,
    text: 'Perfil',
    onClick: redirectToProfile
  }, {
    IconComponent: iconComponents.Logout,
    text: 'Cerrar Sesión',
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

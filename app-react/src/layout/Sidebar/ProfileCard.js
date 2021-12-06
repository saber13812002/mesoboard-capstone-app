import './ProfileCard.css';
<<<<<<< HEAD
import { useHistory } from 'react-router-dom';
import { urlPaths } from '../../services/urlService';

const ProfileCard = ({ profileCardDimensions, onHideCard, onLogout }) => {
  const history = useHistory()
  const redirectToProfile = () => history.push(urlPaths.profile)

=======
import { Icon, iconComponents } from '../../components';

const ProfileCard = ({ cardDimensions, onHideCard, onLogout }) => {
  // console.log('cardDimensions', cardDimensions);
>>>>>>> 6d4edcc861cde5cf1a19c77e00da8fa860c7fb29
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
      style={{ top: cardDimensions.top + 'px', left: cardDimensions.left + 'px', width: cardDimensions.width + 'px' }}
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

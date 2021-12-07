import './ProfileCard.css';
import { Icon, iconComponents } from '../../components';
import { useHistory } from 'react-router-dom';
import { urlPaths, urlSlugs } from '../../services/urlService';

const ProfileCard = ({ cardDimensions, onHideCard, onLogout }) => {
  const history = useHistory();
  const redirectToProfile = () => history.push(urlPaths.profile);

  // console.log('cardDimensions', cardDimensions);
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

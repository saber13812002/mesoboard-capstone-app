import { useContext } from 'react'
import './SidebarProfileSection.css'
import { Icon, iconComponents } from '../../components'
import { AuthContext } from '../../store'

const SidebarProfileSection = ({ onProfileCard }) => {
  const { authState } = useContext(AuthContext)
  const { firstName, lastName } = authState;

  // add user info from context
  return (
    <div className='sidebarProfileSection'>
      <p>Welcome{firstName && <>,</>}</p>
      <div className='sidebarProfileSection__clickableName' onClick={onProfileCard}>
        {firstName && <>
          <p>{firstName} {lastName}</p>
          <div className='sidebarProfileSection__icon'>
            <Icon
              IconComponent={iconComponents.CaretDown}
              size='sm'
              color='dark'
              className='mt-1'
            />
          </div>
        </>}
      </div>
    </div >
  )
}

export default SidebarProfileSection
import { useContext } from 'react'
import './SidebarProfileSection.css'
import { Icon, ICON_OPTIONS } from '../../components'
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
            <Icon icon={ICON_OPTIONS.caretDown} />
          </div>
        </>}
      </div>
    </div >
  )
}

export default SidebarProfileSection

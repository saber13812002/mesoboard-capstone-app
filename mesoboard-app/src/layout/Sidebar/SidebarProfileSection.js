import './SidebarProfileSection.css'
import { Icon, ICON_OPTIONS } from '../../components/index'

const SidebarProfileSection = ({ onProfileCard }) => {
  return (
    <div className='sidebarProfileSection'>
      <p>Welcome,</p>
      <div className='sidebarProfileSection__clickableName' onClick={onProfileCard}>
        <p>Ismael Serrano</p>
        <div className='sidebarProfileSection__icon'>
          <Icon icon={ICON_OPTIONS.caretDown} />
        </div>
      </div>
    </div>
  )
}

export default SidebarProfileSection

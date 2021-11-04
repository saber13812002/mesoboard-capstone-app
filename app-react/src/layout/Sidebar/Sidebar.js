import { useState } from 'react'
import './Sidebar.css'
import SidebarList from './SidebarList'
import MesonLogoContainer from '../../components/logos/MesonLogoContainer'
import SidebarProfileSection from './SidebarProfileSection'

const Sidebar = () => {
  const [displayProfileCard, setDisplayNavDrawer] = useState(false)

  /**
   * Display a card with at least the profile and logout items
   * with the use of useRef hook
   */
  const handleProfileCard = () => {
    displayProfileCard(true)
  }

  return (
    <>
      {window.innerWidth > 425 && (
        <div className='sidebar'>
          <MesonLogoContainer />
          <hr />
          <SidebarProfileSection onProfileCard={handleProfileCard} />
          <SidebarList />
        </div>
      )}
    </>
  )
}

export default Sidebar

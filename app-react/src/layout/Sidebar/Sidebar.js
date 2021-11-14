import { useState, useContext } from 'react'
import './Sidebar.css'
import { AuthContext } from '../../store'
import { Redirect } from 'react-router-dom'
import SidebarList from './SidebarList'
import MesonLogoContainer from '../../components/logos/MesonLogoContainer'
import SidebarProfileSection from './SidebarProfileSection'
import { isLoggedOut } from '../../services/authService'

const Sidebar = () => {
  const [redirectToSignin, setRedirectToSignin] = useState(isLoggedOut()) //temporary logout HERE
  // const [displayProfileCard, setDisplayProfileCard] = useState(false)
  const { logout } = useContext(AuthContext)

  /**
   * Display a card with at least the profile and logout items
   * with the use of useRef hook
   */
  const handleProfileCard = () => {
    logout(setRedirectToSignin) //temporary logout
    // setDisplayProfileCard(true)
  }

  return (
    <>
      {window.innerWidth > 425 && <>
        {redirectToSignin && <Redirect to={'/signin'} />}
        {!redirectToSignin &&
          <div className='sidebar'>
            <MesonLogoContainer />
            <hr />
            <SidebarProfileSection onProfileCard={handleProfileCard} />
            <SidebarList />
          </div>
        }
      </>}
    </>
  )
}

export default Sidebar
import { useState, useEffect, useContext, useRef } from 'react'
import './Sidebar.css'
import SidebarList from './SidebarList'
import MesonLogoContainer from '../../components/logos/MesonLogoContainer'
import { AuthContext } from '../../store'
import { Redirect } from 'react-router-dom'
import { ProfileSection } from '..'
import { isLoggedOut } from '../../services/authService'
import { allLinks, SidebarItem } from '../../services/sidebarService'

console.log('SIDEBAR code that outside component - only runs once')

// all sidebar item instances
const homeItem = new SidebarItem(allLinks.HOME);
const scheduleItem = new SidebarItem(allLinks.SCHEDULE);
const profilesItem = new SidebarItem(allLinks.PROFILES);
const requestsItem = new SidebarItem(allLinks.REQUESTS);
const checksItem = new SidebarItem(allLinks.CHECKS);
const memosItem = new SidebarItem(allLinks.MEMOS);
const permissionsItem = new SidebarItem(allLinks.PERMISSIONS);

// initialize sidebar list with items that are shared by every type of user
homeItem.setNext(scheduleItem)
scheduleItem.setNext(requestsItem)
requestsItem.setNext(checksItem)
checksItem.setNext(memosItem)

const Sidebar = () => {
  const [redirectToSignin, setRedirectToSignin] = useState(isLoggedOut()); //temporary logout HERE
  const [sidebarItems, setSidebarItems] = useState([]);
  // const [profileCardPos, setProfileCardPos] = useState({});
  // const [displayProfileCard, setDisplayProfileCard] = useState(false)
  const profileNameEl = useRef(null);
  const { authState, logout } = useContext(AuthContext);
  const { userType } = authState;


  useEffect(() => {
    // console.log('userType', userType)
    switch (userType) {
      case 'admin':
        scheduleItem.setNext(profilesItem);
        memosItem.setNext(permissionsItem);
        break;
      default:
        break;
    }
    setSidebarItems(homeItem.toArray())
  }, [userType])

  const handleLogout = () => {
    logout(setRedirectToSignin)
  }

  return (
    <>
      {(window.innerWidth > 425) && <>
        {redirectToSignin && <Redirect to={'/signin'} />}
        {!redirectToSignin &&
          <div className='sidebar'>
            <MesonLogoContainer />
            <hr />
            <ProfileSection profileNameEl={profileNameEl} onLogout={handleLogout} />
            {(sidebarItems.length > 0) && <SidebarList sidebarItems={sidebarItems} />}
          </div>
        }
      </>}
    </>
  )
}

export default Sidebar
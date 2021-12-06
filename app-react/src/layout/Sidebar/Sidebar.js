import { useState, useEffect, useContext, useRef } from 'react'
import './Sidebar.css';
import SidebarList from './SidebarList';
import MesonLogoContainer from '../../components/logos/MesonLogoContainer';

import { AuthContext } from '../../store';
import { Redirect } from 'react-router-dom';
import { ProfileSection } from '..';
import { isLoggedOut } from '../../services/authService';
import { allLinks, SidebarItem } from '../../services/sidebarService';


// initialize all sidebar item instances
let homeItem = new SidebarItem(allLinks.HOME);
let scheduleItem = new SidebarItem(allLinks.SCHEDULE);
let profilesItem = new SidebarItem(allLinks.PROFILES);
let requestsItem = new SidebarItem(allLinks.REQUESTS);
// let checksItem = new SidebarItem(allLinks.CHECKS);
let memosItem = new SidebarItem(allLinks.MEMOS);
let permissionsItem = new SidebarItem(allLinks.PERMISSIONS);

const Sidebar = () => {
  const [redirectToSignin, setRedirectToSignin] = useState(isLoggedOut()); //temporary logout HERE
  const [sidebarItems, setSidebarItems] = useState([]);
  // const [profileCardPos, setProfileCardPos] = useState({});
  // const [displayProfileCard, setDisplayProfileCard] = useState(false)
  const profileNameEl = useRef(null);
  const { authState, logout } = useContext(AuthContext);
  const { userType } = authState;

  useEffect(() => {
    if (!userType) return;

    // initialize sidebar list with items that are shared by every type of user
    homeItem.setNext(requestsItem);
    requestsItem.setNext(memosItem);

    // add items by type of user
    switch (userType) {
      case 'manager':
        homeItem.setNext(scheduleItem);
        scheduleItem.setNext(profilesItem);
        memosItem.setNext(permissionsItem);
        break;
      case 'admin':
        memosItem.setNext(permissionsItem);
        break;
      case 'manager':
        memosItem.setNext(permissionsItem);
      default:
        homeItem.setNext(scheduleItem);
        break;

    }
    setSidebarItems(homeItem.toArray());
  }, [userType]);


  // clear sidebar item next references on dismount
  useEffect(() => {
    if (redirectToSignin)
      return () => homeItem.clearAll()
  }, [redirectToSignin]);

  const handleLogout = () => {
    logout().then(redirect => setRedirectToSignin(redirect));
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
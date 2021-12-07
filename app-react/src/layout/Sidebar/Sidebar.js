import { useState, useEffect, useContext, useRef } from 'react'
import './Sidebar.css';
import SidebarList from './SidebarList';
import MesonLogoContainer from '../../components/logos/MesonLogoContainer';

import { AuthContext } from '../../store';
import { Redirect } from 'react-router-dom';
import { ProfileSection } from '..';
import { isLoggedOut } from '../../services/authService';
import { allLinks, SidebarItem } from '../../services/sidebarService';
import { urlSlugs } from '../../services/urlService';
import { userTypes } from '../../services/authService';


// initialize all sidebar item instances
let scheduleItem = new SidebarItem(allLinks.SCHEDULE);
let profilesItem = new SidebarItem(allLinks.PROFILES);
// let requestsItem = new SidebarItem(allLinks.REQUESTS);
// let checksItem = new SidebarItem(allLinks.CHECKS);
// let memosItem = new SidebarItem(allLinks.MEMOS);
let permissionsItem = new SidebarItem(allLinks.PERMISSIONS);

// variables
const rootItem = scheduleItem;
const { managerType, adminType } = userTypes;

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

    // // initialize sidebar list with items that are shared by every type of user
    scheduleItem.setNext(profilesItem)
    // scheduleItem.setNext(requestsItem); //request component is priority to implement

    console.log('userType', userType);
    console.log('managerType', managerType);

    // add items by type of user
    switch (userType) {
      case managerType.value:
        // requestsItem.setNext(profilesItem);
        profilesItem.setNext(permissionsItem);
        break;
      case adminType.value:
        // requestsItem.setNext(profilesItem);
        profilesItem.setNext(permissionsItem);
      default:
        break;
    }
    setSidebarItems(rootItem.toArray());
  }, [userType]);


  // clear sidebar item next references on dismount
  useEffect(() => {
    if (redirectToSignin)
      return () => rootItem.clearAll()
  }, [redirectToSignin]);

  const handleLogout = () => {
    logout().then(redirect => setRedirectToSignin(redirect));
  }

  return (
    <>
      {(window.innerWidth > 425) && <>
        {redirectToSignin && <Redirect to={`/${urlSlugs.signin}`} />}
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
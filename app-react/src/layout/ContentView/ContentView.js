import './ContentView.css';
import { useContext } from 'react';
import { getUrlSlug, urlSlugs } from '../../services/urlService';
import { useRouteMatch } from 'react-router-dom';
import { ContentHeader } from '../../components';
import { userTypes } from '../../services/authService';
import { AuthContext } from '../../store';
import {
  ScheduleManager,
  ProfilesManager,
  UserPermissionsManager,
  ScheduleEmployee,
  Profile
} from '../../contentView';

/** returns the component to be viewed */
const handleView = (view, userType) => {
  const { schedule, profiles, permissions } = urlSlugs;

  switch (view) {
    case schedule:
      if (userType === userTypes.employee.value)
        return <ScheduleEmployee />
      else if (userType === userTypes.manager.value) {
        return <ScheduleManager />
      }
      else return <></>;
    case profiles:
      return <ProfilesManager />
    case permissions:
      return <UserPermissionsManager />
    default:
      return <Profile />
  }
}

const ContentView = () => {
  let { url } = useRouteMatch();
  const slug = getUrlSlug(url);

  const { authState } = useContext(AuthContext);
  const { userType } = authState;

  return (
    <div className='body'>
      <ContentHeader view={slug} />
      <div className='body__content'>
        {handleView(slug, userType)}
      </div>
    </div>
  )
}

export default ContentView

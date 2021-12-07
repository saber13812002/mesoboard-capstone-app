import './ContentView.css';
import { getUrlSlug, urlSlugs } from '../../services/urlService';
import { useRouteMatch } from 'react-router-dom';
import { ContentHeader } from '../../components';
import {
  ScheduleManager,
  ProfilesManager,
  UserPermissionsManager,
  Profile
} from '../../contentView';

/** returns the component to be viewed */
const handleView = view => {
  const { schedule, profiles, permissions, profile } = urlSlugs;

  switch (view) {
    case schedule:
      return <ScheduleManager />
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

  return (
    <div className='body'>
      <ContentHeader view={slug} />
      <div className='body__content'>
        {handleView(slug)}
      </div>
    </div>
  )
}

export default ContentView

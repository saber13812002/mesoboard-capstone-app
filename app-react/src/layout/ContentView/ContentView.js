import './ContentView.css'
import { getUrlSlug, urlSlugs } from '../../services/urlService'
import { useRouteMatch } from 'react-router-dom'
import { ContentHeader } from '../../components'
import {
  Profile,
  HomeManager,
  ScheduleManager,
  ProfilesManager,
  MemoManager,
  RequestManager,
  UserPermissionsManager
} from '../../contentView'

/** returns the component to be viewed */
const handleView = view => {
  const { profile, home, schedule, profiles, requests, memos, permissions } = urlSlugs;

  switch (view) {
    case profile:
      return <Profile />
    case home:
      return <HomeManager />
    case schedule:
      return <ScheduleManager />
    case profiles:
      return <ProfilesManager />
    case requests:
      return <RequestManager />
    case memos:
      return <MemoManager />
    case permissions:
      return <UserPermissionsManager />
    default:
      return <MemoManager />
  }
}

const ContentView = () => {
  let { url } = useRouteMatch();
  const slug = getUrlSlug(url)
  // console.log('url', urlSlug(url))

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

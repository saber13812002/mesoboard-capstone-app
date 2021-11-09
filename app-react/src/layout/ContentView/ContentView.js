import './ContentView.css'
import { urlSlug } from '../../services/url'
import { useRouteMatch } from 'react-router-dom'
import { ContentHeader } from '../../components'
import {
  HomeManager,
  ScheduleManager,
  CheckManager,
  ProfileManager,
  MemoManager,
  RequestManager,
  UserPermissionsManager
} from '../../contentView'

/** returns the component to be viewed */
const handleView = view => {
  switch (view) {
    case 'home':
      return <HomeManager />
    case 'schedule':
      return <ScheduleManager />
    case 'checks':
      return <CheckManager />
    case 'profiles':
      return <ProfileManager />
    case 'request':
      return <RequestManager />
    case 'permissions':
      return <UserPermissionsManager />
    default:
      return <MemoManager />
  }
}

const ContentView = () => {
  let { url } = useRouteMatch();
  // console.log('url', urlSlug(url))

  return (
    <div className='body'>
      <ContentHeader view={urlSlug(url)} />
      <div className='body__content'>
        {handleView(urlSlug(url))}
      </div>
    </div>
  )
}

export default ContentView

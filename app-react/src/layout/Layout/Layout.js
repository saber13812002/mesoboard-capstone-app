import { useEffect, useContext } from 'react'
import { AuthContext } from '../../store'
import './Layout.css'
import {
  Navbar,
  Sidebar,
  ContentView
} from '..'


const Layout = () => {
  // let { path } = useRouteMatch();
  // console.log('Layout path', path)
  const { authState, fetchUserDataByToken } = useContext(AuthContext)
  const { userType } = authState;

  useEffect(() => {
    // console.log('LAYOUT uType', userType)
    if (!userType) {
      console.log('fetching credentials')
      if (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
        fetchUserDataByToken()
      else //timeout to wait until node app restart on page reload or saved work
        setTimeout(() => fetchUserDataByToken(), 5000)
    }
  }, [])


  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <Sidebar />
      </aside>
      <header className="layout__navbar">
        <Navbar />
      </header>
      <main className="layout__body">
        <ContentView />
      </main>
    </div>
  )
}

export default Layout

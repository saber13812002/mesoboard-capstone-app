import React from 'react'
import './Layout.css'
import {
  Navbar,
  Sidebar,
  ContentView
} from '../index'



const Layout = () => {
  // let { path } = useRouteMatch();
  // console.log('Layout path', path)

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

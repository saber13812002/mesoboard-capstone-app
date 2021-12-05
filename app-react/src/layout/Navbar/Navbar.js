import { useState } from 'react'
import './Navbar.css'
import { Icon, iconComponents, NavDrawer } from '../../components'

// const amountNotificationLabel = () => {
//   const [notificationAmount, setNotificationAmount] = useState(0)

//   return (
//     <>
//       {/* Label of the amount of notifications */}
//     </>
//   )
// }

const Navbar = () => {
  const [displayNavDrawer, setDisplayNavDrawer] = useState(false)

  const openNavDrawer = () => {
    setDisplayNavDrawer(true)
  }

  const closeNavDrawer = () => {
    setDisplayNavDrawer(false)
  }

  return (
    <div className='navbar'>
      {window.innerWidth <= 425 && (
        <div onClick={openNavDrawer}>
          <Icon
            IconComponent={iconComponents.Bars}
            size='md'
            color='dark'
            className='mb-1'
          />
        </div>
      )}
      <div className='navbar__icon'>
        <Icon
          IconComponent={iconComponents.Bell}
          size='lg'
          color='primary'
          className='mb-1'
        />
      </div>
      {displayNavDrawer && (
        <NavDrawer
          onClose={closeNavDrawer}
        />
      )}
    </div>
  )
}

export default Navbar

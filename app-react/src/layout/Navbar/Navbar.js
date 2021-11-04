import { useState } from 'react'
import './Navbar.css'
import {
  NavDrawer,
  Icon,
  ICON_OPTIONS
} from '../../components'

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
        <div className='navbar__icon navbar__barsIcon' onClick={openNavDrawer}>
          <Icon icon={ICON_OPTIONS.bars} />
        </div>
      )}
      <div className='navbar__icon navbar__bellIcon'>
        <Icon icon={ICON_OPTIONS.bell} />
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

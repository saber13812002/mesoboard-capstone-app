import './Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { Icon, iconComponents, NavDrawer } from '../../components';
import { NotificationCard } from '..';
import { ServerRoutes as server } from '../../services/apiService';
import axios from 'axios';


// const NotificationAmountLabel = ({ unseenNotificationAmount }) => {
const NotificationAmountLabel = ({ unseenNotificationAmount }) => {
  // const [unseenNotificationAmount, setUnseenNotificationAmount] = useState(0)
  console.log('unseenNotificationAmount', unseenNotificationAmount)
  // useEffect(() => {
  //   axios.get(server.getAllUnseenNotifications()).then(res => {
  //     // console.log('unseen', res.data.notifications)
  //     setUnseenNotificationAmount(res.data.notifications.length)
  //   })
  // }, [])

  //       axios.post(server.markNotificationsAsSeen())


  return (
    <div className='notificationAmountLabel'>
      {/* Label of the amount of notifications */}
      {(unseenNotificationAmount > 0) && (
        <span className="label">{unseenNotificationAmount}</span>
      )}
    </div>
  )
}


const Navbar = () => {
  const [displayNavDrawer, setDisplayNavDrawer] = useState(false);
  const [notificationCardDimensions, setNotificationCardDimensions] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unseenNotificationAmount, setUnseenNotificationAmount] = useState(0)

  const bellIconEl = useRef(null);

  useEffect(() => {
    console.log(server.getAllNotifications());
    const fetchNotifications = async () => {
      axios.get(server.getAllNotifications()).then(res => {
        console.log('res.data', res.data)
        setNotifications(res.data.notifications)
      })

      axios.get(server.getAllUnseenNotifications()).then(res => {
        // console.log('unseen', res.data.notifications)
        setUnseenNotificationAmount(res.data.notifications.length)
      })
    }
    fetchNotifications()
  }, [])

  const hideNotificationCard = () => setNotificationCardDimensions({})

  const openNavDrawer = () => {
    setDisplayNavDrawer(true)
  }

  const closeNavDrawer = () => {
    setDisplayNavDrawer(false)
  }



  const toggleNotificationCard = () => {
    // console.log(bellIconEl.current.offsetRight, bellIconEl.current.offsetLeft)
    const isAlreadyOpen = Object.keys(notificationCardDimensions).length > 0
    if (isAlreadyOpen)
      hideNotificationCard()
    else {
      if (unseenNotificationAmount > 0) {
        axios.post(server.markNotificationsAsSeen()).then(_ => {
          setUnseenNotificationAmount(0);
        })
      }
      const bellItenMarginRight = 32;
      setNotificationCardDimensions({
        top: bellIconEl.current.offsetTop + bellIconEl.current.offsetHeight,
        right: bellItenMarginRight - bellIconEl.current.offsetWidth - 8,
      });
    }
  }

  // const handlePressingBell = () => {
  //   const isAlreadyOpen = Object.keys(notificationCardDimensions).length > 0
  //   if (isAlreadyOpen) {
  //     hideNotificationCard();
  //   }
  // }

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
      <div className='navbar__icon' ref={bellIconEl}
      // onMouseEnter={showNotificationCard}
      // onMouseLeave={() => setNotificationCardDimensions({})}
      // onClick={() => setNotificationCardDimensions({})}
      >
        <Icon
          IconComponent={iconComponents.Bell}
          size='lg'
          color='primary'
          className='mb-1'
          onClick={toggleNotificationCard}
        />
        <NotificationAmountLabel unseenNotificationAmount={unseenNotificationAmount} />
      </div>
      {Object.keys(notificationCardDimensions).length > 0 && (
        <NotificationCard cardDimensions={notificationCardDimensions} notifications={notifications} onHideCard={hideNotificationCard} />
      )}
      {displayNavDrawer && (
        <NavDrawer
          onClose={closeNavDrawer}
        />
      )}
    </div>
  )
}

export default Navbar

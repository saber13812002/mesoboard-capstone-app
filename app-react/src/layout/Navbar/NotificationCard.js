// import { useState, useEffect } from 'react';
import './NotificationCard.css';
import { truncateNotificationText } from '../../services/authService'
import { beautifyDate } from '../../services/scheduleService'
// import { ServerRoutes as server } from '../../services/apiService';
// import axios from 'axios';

const NotificationCard = ({ cardDimensions, notifications, /* unseenNotificationAmount,*/ onHideCard }) => {
  // const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   // console.log('notifications', notifications);
  //   axios.get(server.getAllNotifications()).then(res => {
  //     console.log('res.data', res.data)
  //     setNotifications(res.data.notifications)
  //   })
  // }, [])


  //// testing
  // notifications = [{
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard li shfa',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // }, {
  //   title: 'User Registered',
  //   body: 'Employee Entity ha sido registrado en Mesoboard',
  //   sent_date: '2021-12-06T19:02:48.584Z',
  //   type: 'new_user'
  // },]

  return (
    <div className='notificationCard'
      // style={{ top: cardDimensions.top + 'px', left: cardDimensions.left + 'px', width: '60px' }}
      // style={{ top: cardDimensions.top + 'px', left: '-115px', width: '140px' }}
      style={{ top: cardDimensions.top + 'px', right: cardDimensions.right + 'px' }}
      onMouseLeave={onHideCard}
    >
      <div className='card'>
        {/* <div className='cardItemContainer'>
          <div className='cardItem'>
            <span>{'text'}</span>
          </div>
        </div> */}
        <span>Notificaciones</span>
        <section>
          {notifications.map((notif, i) => {
            // console.log('notif', notif)
            let { title, body, sent_date } = notif
            sent_date = beautifyDate(new Date(sent_date))

            console.log('notif', notif)
            return (
              <div key={i} className='cardItemContainer'>
                <div className='cardItem user-select-none'>
                  <p>{truncateNotificationText(body)}</p>
                  <small><b>{sent_date}</b></small>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default NotificationCard

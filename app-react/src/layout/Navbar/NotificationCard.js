// import { useState, useEffect } from 'react';
import './NotificationCard.css';
import { truncateNotificationText } from '../../services/authService'
import { beautifyDate } from '../../services/scheduleService'

const NotificationCard = ({ cardDimensions, notifications, /* unseenNotificationAmount,*/ onHideCard }) => {
  return (
    <div className='notificationCard'
      // style={{ top: cardDimensions.top + 'px', left: cardDimensions.left + 'px', width: '60px' }}
      // style={{ top: cardDimensions.top + 'px', left: '-115px', width: '140px' }}
      style={{ top: cardDimensions.top + 'px', right: cardDimensions.right + 'px' }}
      onMouseLeave={onHideCard}
    >
      <div className='card'>
        <span>Notificaciones</span>
        <section>
          {notifications.map((notif, i) => {
            // console.log('notif', notif)
            let { body, sent_date } = notif
            sent_date = beautifyDate(new Date(sent_date))

            // console.log('notif', notif)
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

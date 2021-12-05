import './ProfileScheduleDetails.css';
import { useState, useEffect } from 'react'
import { BackButton } from '../../../components';
import { DetailsCard } from '../..'
import { get12HourFormatOfDate, getDayName, getScheduleIdOfMoment } from '../../../services/scheduleService';
import axios from 'axios';
import moment from 'moment';

const ProfileScheduleDetails = ({ userScheduleData, currentMoment, weekStartMoment, onBack }) => {
  const [mCurrent, setMCurrent] = useState(currentMoment ? currentMoment.clone() : moment()) // the current moment
  // const [userScheduleData, setUserScheduleData] = useState({}) // the current moment

  // useEffect(() => {
  //   // if (userScheduleData.length > 0) return;

  //   const getUserWithSchedule = async () => {
  //     const scheduleId = getScheduleIdOfMoment(weekStartMoment);
  //     const url = server.getUserWithSchedule(userId, scheduleId);
  //     console.log('url', url)
  //     axios.get(url).then(res => {
  //       console.log('res.data.userScheduleData', res.data.userScheduleData)
  //       setUserScheduleData(res.data.userScheduleData)
  //     })
  //       .catch(err => console.log(err))
  //   }
  //   getUserWithSchedule();
  // }, []);

  const { weekDates } = userScheduleData;
  console.log('---userScheduleData', userScheduleData);

  return (
    <>
      {(Object.keys(userScheduleData).length > 0) && <>
        <BackButton onClick={onBack} />
        <DetailsCard data={userScheduleData} />

        <div className='d-flex flex-wrap gap-3'>
          {weekDates.length === 0 && (
            <p>No tiene horarios para esta semana</p>
          )}
          {weekDates.map((weekDate, day) => {
            if (weekDate)
              return (
                <div key={day} className='scheduleDetails__Cards card p-3 pb-0'>
                  <div className='dayName'>
                    <h5>{getDayName(day)}</h5>
                  </div>
                  <div className='timeInfo start'>
                    <span>Start</span>
                    <span className='time'>{get12HourFormatOfDate(weekDate.dateStart)}</span>
                  </div>
                  <div className='timeInfo end'>
                    <span>End</span>
                    <span className='time'>{get12HourFormatOfDate(weekDate.dateEnd)}</span>
                  </div>
                  <div className='timeInfo lunch'>
                    <span>Lunch</span>
                    <span className='time'>{get12HourFormatOfDate(weekDate.dateLunch)}</span>
                  </div>
                </div>
              )
          })}
        </div>
      </>}
    </>
  )
}

export default ProfileScheduleDetails

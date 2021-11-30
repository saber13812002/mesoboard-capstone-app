import './ProfileScheduleDetails.css';
import { BackButton } from '../../components';
import { get12HourFormatOfDate, getDayName } from '../../services/scheduleService';

const ProfileScheduleDetails = ({ employee, onBack }) => {
  console.log('employee', employee)
  const { employeeName, weekDates } = employee;
  // const employeeHasSchedule = employee.weekDates.filter(wd => wd != null).length > 0
  return (
    <>
      <BackButton onClick={onBack} />
      {employee.first_name && <div className='scheduleDetails__profileInfo mt-3 p-3'>
        <h4>{employeeName}</h4>
        <h3>Profile Information Here</h3>
      </div>}
      <div className='d-flex flex-wrap mt-3'>
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
    </>
  )
}

export default ProfileScheduleDetails

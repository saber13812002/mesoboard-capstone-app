import './ScheduleHoursBox.css'
import { get12HourFormatOfDate } from '../../../services/scheduleService'

const ScheduleHoursBox = ({ isHourLunch, weekDate, showLunchMins = true, className = '' }) => {
  // console.log('weekDate', weekDate);
  const { dateStart, dateEnd, dateLunch } = weekDate;

  // start and end of work schedule
  const timeStart = get12HourFormatOfDate(dateStart);
  const timeEnd = get12HourFormatOfDate(dateEnd);

  // start and end of lunch time
  const timeLunchStart = get12HourFormatOfDate(dateLunch);
  const lunchEndDate = new Date(dateLunch);
  lunchEndDate.setMinutes(lunchEndDate.getMinutes() + (isHourLunch ? 60 : 30))
  const timeLunchEnd = get12HourFormatOfDate(lunchEndDate);

  return (
    <div className={`scheduleHoursBox ${className}`}>
      <span>{timeStart}-{timeEnd}</span>
      <br />
      {showLunchMins && (<>
        <span>Meal:{isHourLunch ? 60 : 30}Mins</span>
        <br />
      </>)}
      <span>({timeLunchStart}-{timeLunchEnd})</span>
    </div>
  )
}

export default ScheduleHoursBox

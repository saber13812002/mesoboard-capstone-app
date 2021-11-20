import './ScheduleHoursBox.css'
import { get12HourFormatOfDate } from '../../../services/scheduleService'

const ScheduleHoursBox = ({ weekDate, showLunchMins = true, className }) => {
  // console.log('weekDate', weekDate);
  const { dateStart, dateEnd, dateLunch, isHourLunch } = weekDate;

  // start and end of work schedule
  const hourStart = get12HourFormatOfDate(dateStart);
  const hourEnd = get12HourFormatOfDate(dateEnd);

  // start and end of lunch time
  const hourLunchStart = get12HourFormatOfDate(dateLunch);
  const lunchEndDate = new Date(dateLunch);
  lunchEndDate.setMinutes(lunchEndDate.getMinutes() + (isHourLunch ? 60 : 30))
  const hourLunchEnd = get12HourFormatOfDate(lunchEndDate);

  return (
    <div className={`scheduleHoursBox ${className}`}>
      <span>{hourStart}-{hourEnd}</span>
      <br />
      {showLunchMins && (<>
        <span>Meal:{isHourLunch ? 60 : 30}Mins</span>
        <br />
      </>)}
      <span>({hourLunchStart}-{hourLunchEnd})</span>
    </div>
  )
}

export default ScheduleHoursBox

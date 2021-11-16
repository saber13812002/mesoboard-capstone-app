import './ScheduleHoursBox.css'
import { get12HourFormatOfDate } from '../../../services/scheduleService'

const ScheduleHoursBox = ({ weekDate, showLunchMins = true, className }) => {
  // console.log('weekDate', weekDate)
  // console.log('get12HourFormatOfDate', get12HourFormatOfDate(weekDate.dateStart))
  const hourStart = get12HourFormatOfDate(weekDate.dateStart)
  const hourEnd = get12HourFormatOfDate(weekDate.dateEnd)
  const hourLunch = get12HourFormatOfDate(weekDate.dateLunch)

  return (
    <div className={`scheduleHoursBox ${className}`}>
      <span>{hourStart}-{hourEnd}</span>
      <br />
      {showLunchMins && (<>
        <span>Meal:{weekDate.isHourLunch ? '60' : '30'}Mins</span>
        <br />
      </>)}
      <span>({hourLunch}-{hourLunch})</span>
    </div>
  )
}

export default ScheduleHoursBox

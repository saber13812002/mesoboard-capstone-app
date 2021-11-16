import './ScheduleHoursBox.css'
import { getHourFormatOf } from '../../../services/scheduleService'

const ScheduleHoursBox = ({ weekDate, showLunchMins = true, className }) => {
  // console.log('weekDate', weekDate)
  // console.log('getHourFormatOf', getHourFormatOf(weekDate.dateStart))
  const hourStart = getHourFormatOf(weekDate.dateStart)
  const hourEnd = getHourFormatOf(weekDate.dateEnd)
  const hourLunch = getHourFormatOf(weekDate.dateStartLunch)

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

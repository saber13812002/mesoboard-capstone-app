import './ScheduleHoursBox.css'

const ScheduleHoursBox = ({ weekday, showMealMins = true, className }) => {
  const { startHour, endHour, lunchHour, isHourLunch } = weekday
  return (
    <div className={`scheduleHoursBox ${className}`}>
      <span>{startHour}-{endHour}</span>
      <br />
      {showMealMins && (<>
        <span>Meal:{isHourLunch ? '60' : '30'}Mins</span>
        <br />
      </>)}
      <span>({lunchHour}-{lunchHour})</span>
    </div>
  )
}

export default ScheduleHoursBox

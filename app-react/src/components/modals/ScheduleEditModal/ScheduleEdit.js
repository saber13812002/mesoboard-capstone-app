import { useState } from 'react'
import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { Icon, iconComponents, MButton } from '../..'
import { getDayName, beautifyDate, get24HourFormatOfHour, toISOString } from '../../../services/scheduleService'
import { ScheduleHoursBox } from '../../../contentView'

const ScheduleEdit = ({ employee, turns, dateStart, dateEnd, onWeekDateAdd, onWeekDateHoursUpdate, onSaveChanges, onCloseScheduleEdit }) => {
  // console.log('employee', employee)
  const [employeeCopy, setEmployeeCopy] = useState(JSON.parse(JSON.stringify(employee))) //deep copy
  const { employeeName, weekDates } = employeeCopy;

  /** Updates the schedule hours of the employee locally */
  const updateHours = (day, e) => {
    const turnId = e.target.value;
    if (!turnId || turnId <= 0 || turnId > turns.length)
      return;

    setEmployeeCopy(emp => {
      // console.log('the old employee instance', emp);
      const newEmployee = { ...emp };
      // console.log('turnId', turnId)

      const selectedTurn = turns[turnId - 1];
      const newStartHour = get24HourFormatOfHour(selectedTurn.hourStart, true);
      const newEndHour = get24HourFormatOfHour(selectedTurn.hourEnd);
      const newLunchHour = get24HourFormatOfHour(selectedTurn.hourLunch);
      // console.log('startHour', startHour)
      // console.log('get24HourFormatOfHour', get24HourFormatOfHour(selectedTurn.hourStart, true))

      const { dateStart, dateEnd, dateLunch } = newEmployee.weekDates[day]

      // create same employee's date with the time of the selected turn. (working with UTC time zone)
      const newDateStart = new Date(`${toISOString(dateStart)}T${newStartHour}Z`).toISOString();
      const newDateEnd = new Date(`${toISOString(dateEnd)}T${newEndHour}Z`).toISOString();
      const newDateLunch = new Date(`${toISOString(dateLunch)}T${newLunchHour}Z`).toISOString();

      // set new date of the given day of the week
      newEmployee.weekDates[day].dateStart = newDateStart
      newEmployee.weekDates[day].dateEnd = newDateEnd
      newEmployee.weekDates[day].dateLunch = newDateLunch

      // console.log('newEmployee', newEmployee)
      return newEmployee
    })
  }

  const portalElement = document.getElementById('navdrawer-portal')
  return (
    <Modal
      onClose={onCloseScheduleEdit}
      portalElement={portalElement}
      classes={classes}
    >
      <div className='scheduleEdit'>
        <h4>{employeeName}</h4>
        <small>{beautifyDate(dateStart)} - {beautifyDate(dateEnd)}</small>
        <div className='d-flex flex-wrap mt-4'>
          {weekDates.map((weekDate, day) => {
            if (!weekDate) {
              return (
                <MButton
                  key={day}
                  IconComponent={iconComponents.Plus}
                  iconColor='dark'
                  text={getDayName(day)}
                  variant='outline-primary'
                  className='mr-2'
                  size='sm'
                  onClick={() => onWeekDateAdd(day)}
                />
              )
            }
            return null
          })}
        </div>
        {weekDates.map((weekDate, day) => {
          if (weekDate) {
            return (
              // THE USE OF 'display: grid' would be best
              <div key={day} className='scheduleEdit__data d-flex justify-content-between align-items-center w-100 mt-3'>
                <h4>{getDayName(day)}</h4>
                <input type='number' onChange={(e) => updateHours(day, e)} />
                <ScheduleHoursBox weekDate={weekDate} showLunchMins={true} className='scheduleEdit__hoursBox' />
                <Icon
                  IconComponent={iconComponents.trash}
                  size='md'
                  color='red'
                />
              </div>
            )
          }
          return null
        })}
        <MButton
          className='w-100 mt-4'
          text='Save Changes'
          variant='primary'
          onClick={() => onSaveChanges(employeeCopy)}
        />
      </div>
    </Modal>
  )
}

export default ScheduleEdit;




/********** TESTING DATE CONVESIONS ************
console.log('dateStart\n', dateStart)
console.log('toISOString(dateStart)', toISOString(dateStart))

console.log('Expected:', '2021-11-17T04:00Z')
  console.log('Resulted:', toISOString(dateStart) + 'T' + startHour + 'Z')
// Start
// const newDateStart = new Date(dateStart); //incorrect: should be new Date(turnDateStart)     the one we want to set
// const newDateStart = new Date('2021-11-11T04:00Z'); //expected: 2021-11-11T4:00Z
// const newDateStart = new Date(toISOString(dateStart) + 'T' + startHour + 'Z'); //expected: 2021-11-11T4:00Z
// const newDateStart = new Date(`${toISOString(dateStart)}T${startHour}Z`).toISOString();
// dateStart = newDateStart.toISOString();

// // End
// const newDateEnd = new Date(`${toISOString(dateEnd)}T${endHour}Z`);
// dateEnd = newDateEnd.toISOString();
// const newDateEnd = new Date(dateEnd);
// newDateEnd.setHours(endHour, endMinute);
// dateEnd = newDateEnd.toISOString();

// // Lunch
// const newDateLunch = new Date(dateLunch);
// newDateLunch.setHours(lunchHour, lunchMinute);

// dateLunch = newDateLunch.toISOString();
************************************************/
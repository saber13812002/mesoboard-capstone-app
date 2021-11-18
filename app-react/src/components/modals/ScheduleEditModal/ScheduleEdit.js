import { useState } from 'react'
import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { Icon, iconComponents, MButton } from '../..'
import { getDayName, beautifyDate, get24HourFormatOfHour } from '../../../services/scheduleService'
import { ScheduleHoursBox } from '../../../contentView'

const ScheduleEdit = ({ employee, turns, dateStart, dateEnd, onWeekDateAdd, onWeekDateHoursUpdate, onSaveChanges, onCloseScheduleEdit }) => {
  const [employeeCopy, setEmployeeCopy] = useState(JSON.parse(JSON.stringify(employee))) //deep copy
  const { employeeName, weekDates } = employeeCopy;

  /** Updates the schedule hours of the employee locally */
  const updateHours = (day, e) => {
    const turnId = e.target.value;
    if (!turnId || turnId <= 0 || turnId > turns.length)
      return;

    setEmployeeCopy(emp => {
      console.log('the old employee instance', emp);
      const newEmployee = { ...emp };
      // console.log('turnId', turnId)
      // console.log('turns', turns)

      const selectedTurn = turns[turnId - 1];
      const [startHour, startMinute] = get24HourFormatOfHour(selectedTurn.hourStart).split(':');
      const [endHour, endMinute] = get24HourFormatOfHour(selectedTurn.hourEnd).split(':');
      const [lunchHour, lunchMinute] = get24HourFormatOfHour(selectedTurn.hourLunch).split(':');

      // const newDateStart = new Date(newEmployee.weekDates[day].dateStart).setHours(startHour, startMinute)
      // const newDateEnd = new Date(newEmployee.weekDates[day].dateEnd).setHours(endHour, endMinute)
      // const newDateLunch = new Date(newEmployee.weekDates[day].dateLunch).setHours(lunchHour, lunchMinute)

      const newDateStart = new Date(newEmployee.weekDates[day].dateStart);
      const newDateEnd = new Date(newEmployee.weekDates[day].dateEnd);
      const newDateLunch = new Date(newEmployee.weekDates[day].dateLunch);

      newDateStart.setHours(startHour, startMinute);
      newDateEnd.setHours(endHour, endMinute);
      newDateLunch.setHours(lunchHour, lunchMinute);

      // console.log('newDateStart', newDateStart)
      // console.log('newDateEnd', newDateEnd)
      // console.log('newDateLunch', newDateLunch)

      newEmployee.weekDates[day].dateStart = newDateStart.toUTCString();
      newEmployee.weekDates[day].dateEnd = newDateEnd.toUTCString();
      newEmployee.weekDates[day].dateLunch = newDateLunch.toUTCString();

      console.log('newEmployee', newEmployee)
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
                <ScheduleHoursBox weekDate={weekDate} showMealMins={false} className='scheduleEdit__hoursBox' />
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

export default ScheduleEdit
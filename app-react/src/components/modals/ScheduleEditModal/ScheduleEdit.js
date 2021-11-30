import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { Icon, iconComponents, MButton } from '../..'
import { ScheduleHoursBox } from '../../../contentView'
import { getDayName, beautifyDate, get24HourFormatOfTime, toISOYearFormat } from '../../../services/scheduleService'


const ScheduleEdit = ({ employee, turns, dateStart, dateEnd, mCurrent, onSaveChanges, onCloseScheduleEdit }) => {
  const deepCopy = JSON.parse(JSON.stringify(employee))
  const deepCopy2 = JSON.parse(JSON.stringify(employee))
  const [employeeToEdit, setEmployeeToEdit] = useState(deepCopy)
  const [employeeOriginal] = useState(deepCopy2)
  const [isSameData, setIsSameData] = useState(true)
  // const [selectedTurnIndex, setSelectedTurnIndex] = useState(undefined)

  const { employeeName, weekDates } = employeeToEdit;

  useEffect(() => {
    setIsSameData(!hasDataChanged())
  }, [employeeToEdit])


  /** Determines if the local employee's week date schedule has changed from its original schedule. */
  const hasDataChanged = () => JSON.stringify(employeeOriginal) != JSON.stringify(employeeToEdit)


  /** Removes week date of a particular employee. More formally, sets the week date property with the given day to null.
   *  @param {number} day the day in number form that represents the day of the week to remove.
   */
  const removeWeekDateFromEmployee = day => {
    setEmployeeToEdit(emp => {
      const newEmployee = { ...emp }
      newEmployee.weekDates[day] = null;
      return newEmployee
    })
  }


  /** Updates the week date value of the employee's week date property with the hours of the first turn. 
   *  Does not update it if there are no turns created.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   *  @param {Event} e the event containing the input value.
   */
  const updateHours = (day, e) => {
    const turnId = e.target.value;
    if (!turnId || turnId <= 0 || turnId > turns.length)
      return;

    // const selectedTurn = turns[turnId];
    const dateToModify = employeeToEdit.weekDates[day].dateStart;
    setTimeOfWeekDate(day, turnId - 1, dateToModify);
  }


  /** Adds week date of the employee. More formally, sets the week date property with the given day to the intended date.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   */
  const setWeekDateIntoEmployee = day => {
    if (turns.length > 0) {
      const turnId = 0;
      const dateToModify = mCurrent.clone().startOf('week').isoWeekday(day + 2).toDate();
      setTimeOfWeekDate(day, turnId, dateToModify);
    }
  }


  /** Sets the hours of the week date schedule of the employee by the given selected turn times.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   *  @param {object} turnId the id of the turn object containing the new times.
   *  @param {string} dateToModify the date of the week to be modified.
   */
  const setTimeOfWeekDate = (day, turnId, dateToModify) => {
    const turn = turns[turnId];
    const newTimeStart = get24HourFormatOfTime(turn.timeStart, true);
    const newTimeEnd = get24HourFormatOfTime(turn.timeEnd, true);
    const newTimeLunch = get24HourFormatOfTime(turn.timeLunch, true);

    // create new dates with the times of the turn. (working with UTC time zone)
    const isoYearFormat = toISOYearFormat(dateToModify);
    const newDateStart = new Date(`${isoYearFormat}T${newTimeStart}Z`).toISOString();
    const newDateEnd = new Date(`${isoYearFormat}T${newTimeEnd}Z`).toISOString();
    const newDateLunch = new Date(`${isoYearFormat}T${newTimeLunch}Z`).toISOString();

    const newWeekDate = {
      turnId: turn.turnId,
      dateStart: newDateStart,
      dateEnd: newDateEnd,
      dateLunch: newDateLunch
    }

    setEmployeeToEdit(emp => {
      const newEmployee = { ...emp };
      newEmployee.weekDates[day] = newWeekDate;
      return newEmployee;
    })
  }

  /**
   * finds the index of the turn with the same turn id as the one given.
   * @param {*} turnId the turn id to find within the turns array
   * @returns the turn index found or undefined turn id does not exist within the turns array
   */
  const getTurnIndexByTurnId = turnId => turns.find(turn => turn.turnId === turnId)?.turnIndex;

  const portalElement = document.getElementById('navdrawer-portal');
  // console.log('employeeToEdit', employeeToEdit)
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
                  className='mr-2 mb-3'
                  size='sm'
                  onClick={() => setWeekDateIntoEmployee(day)}
                />
              )
            }
            return null
          })}
        </div>
        <div className='scheduleEdit__data'>
          {weekDates.map((weekDate, day) => {
            if (weekDate) {
              const turnIndex = getTurnIndexByTurnId(weekDate.turnId) || 0;
              // console.log('turnIndex', turnIndex);

              return (
                <div key={day} className='scheduleEdit__row w-100 mt-2'>
                  <Icon
                    IconComponent={iconComponents.trash}
                    size='md'
                    color='red'
                    onClick={() => removeWeekDateFromEmployee(day)}
                  />
                  <h4>{getDayName(day)}</h4>
                  <input type='number' defaultValue={turnIndex} onChange={(e) => updateHours(day, e)} />
                  <ScheduleHoursBox weekDate={weekDate} showLunchMins={true} />
                </div>
              )
            }
            return null
          })}
        </div>
        {isSameData ? (
          <Button
            disabled={true}
            className='w-100 mt-4'
            variant='primary'
          >Save Changes</Button>
        ) : (
          <MButton
            className='w-100 mt-4'
            text='Save Changes'
            variant='primary'
            onClick={() => onSaveChanges(employeeToEdit)}
          />
        )}
      </div>
    </Modal>
  )
}

export default ScheduleEdit;

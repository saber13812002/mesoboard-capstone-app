import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { Icon, iconComponents, MButton } from '../..'
import { ScheduleHoursBox } from '../../../contentView'
import { getDayName, beautifyDate, get24HourFormatOfTime, toISOYearFormat } from '../../../services/scheduleService'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const ScheduleEdit = ({ user, turns, dateStart, dateEnd, mCurrent, onSaveChanges, onCloseScheduleEdit }) => {
  const deepCopy = JSON.parse(JSON.stringify(user))
  const deepCopy2 = JSON.parse(JSON.stringify(user))
  const [userToEdit, setUserToEdit] = useState(deepCopy)
  const [userOriginal] = useState(deepCopy2)
  const [isSameData, setIsSameData] = useState(true)
  // const [selectedTurnIndex, setSelectedTurnIndex] = useState(undefined)

  const { name, weekDates } = userToEdit;
  const ids = turns.map(turn => turn.turnIndex)

  useEffect(() => {
    setIsSameData(!hasDataChanged())
  }, [userToEdit])


  /** Determines if the local user's week date schedule has changed from its original schedule. */
  const hasDataChanged = () => JSON.stringify(userOriginal) != JSON.stringify(userToEdit)


  /** Removes week date of a particular user. More formally, sets the week date property with the given day to null.
   *  @param {number} day the day in number form that represents the day of the week to remove.
   */
  const removeWeekDateFromUser = day => {
    setUserToEdit(emp => {
      const newUser = { ...emp }
      newUser.weekDates[day] = null;
      return newUser
    })
  }


  /** Updates the week date value of the user's week date property with the hours of the first turn. 
   *  Does not update it if there are no turns created.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   *  @param {Event} e the event containing the input value.
   */
  const updateHours = (day, e) => {
    // console.log(e.value)
    const turnIndex = e.value;
    if (!turnIndex || turnIndex <= 0 || turnIndex > turns.length)
      return;

    const dateToModify = userToEdit.weekDates[day].dateStart;
    setTimeOfWeekDate(day, turnIndex, dateToModify);
  }


  /** Adds week date of the user. More formally, sets the week date property with the given day to the intended date.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   */
  const setWeekDateIntoUser = day => {
    if (turns.length > 0) {
      const turnIndex = 1;
      const dateToModify = mCurrent.clone().startOf('week').isoWeekday(day + 2).toDate();
      setTimeOfWeekDate(day, turnIndex, dateToModify);
    }
  }


  /** Sets the hours of the week date schedule of the user by the given selected turn times.
   *  @param {number} day the day in number form that represents the day of the week to modify.
   *  @param {object} turnIndex the id of the turn object containing the new times.
   *  @param {string} dateToModify the date of the week to be modified.
   */
  const setTimeOfWeekDate = (day, turnIndex, dateToModify) => {
    // console.log('turnIndex', turnIndex)
    const turn = turns[turnIndex - 1];
    // console.log('turn', turn)

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

    setUserToEdit(emp => {
      const newUser = { ...emp };
      newUser.weekDates[day] = newWeekDate;
      return newUser;
    })
  }
  const updateLunch = (e) => {
    //console.log(e.target.checked)
    setUserToEdit(emp => {
      const newUser = { ...emp };
      newUser.isHourLunch = e.target.checked;
      console.log(newUser.isHourLunch)
      return newUser;
    })
  }

  /**
   * finds the index of the turn with the same turn id as the one given.
   * @param {*} turnId the turn id to find within the turns array
   * @returns the turn index found or undefined turn id does not exist within the turns array
   */
  const getTurnIndexByTurnId = turnId => turns.find(turn => turn.turnId === turnId)?.turnIndex;

  const portalElement = document.getElementById('navdrawer-portal');

  // console.log('userToEdit', userToEdit)
  return (
    <Modal
      onClose={onCloseScheduleEdit}
      portalElement={portalElement}
      classes={classes}
    >
      <div className='scheduleEdit'>
        <h4>{name}</h4>
        <small>{beautifyDate(dateStart)} - {beautifyDate(dateEnd)}</small>
        <div className='d-flex flex-wrap mt-4'>
          {weekDates.map((weekDate, day) => {
            if (!weekDate) {
              return (
                <MButton
                  key={day + name}
                  IconComponent={iconComponents.Plus}
                  iconColor='dark'
                  text={getDayName(day)}
                  variant='outline-primary'
                  className='mr-2 mb-3'
                  size='sm'
                  onClick={() => setWeekDateIntoUser(day)}
                />
              )
            }
            return null
          })}
        </div>
        <div className='scheduleEdit__data'>
          {weekDates.map((weekDate, day) => {
            if (weekDate) {
              const turnIndex = getTurnIndexByTurnId(weekDate.turnId);
              // console.log('turnIndex', turnIndex);

              return (
                <div key={day + turnIndex} className='scheduleEdit__row w-100 mt-2'>
                  <Icon
                    IconComponent={iconComponents.Trash}
                    size='md'
                    color='red'
                    onClick={() => removeWeekDateFromUser(day)}
                  />
                  <h4>{getDayName(day)}</h4>
                  {<Dropdown
                    value={turnIndex}
                    options={ids}
                    onChange={(e) => updateHours(day, e)}
                    arrowOpen={<span className="arrow-open" />}
                  />}
                  <ScheduleHoursBox isHourLunch={userToEdit.isHourLunch} weekDate={weekDate} showLunchMins={true} />
                </div>
              )
            }
            return null
          })}
        </div>
        <label className='mt-4 mb-1'>
          <input type="checkbox" onChange={(e) => updateLunch(e)} checked={userToEdit.isHourLunch} />
          <span className='ml-1'>1 hora de almuerzo</span>
        </label>
        {isSameData ? (
          <Button
            disabled={true}
            className='w-100 mt-4'
            variant='primary'
          >Guardar Cambios</Button>
        ) : (
          <MButton
            className='w-100 mt-4'
            text='Guardar Cambios'
            variant='primary'
            onClick={() => onSaveChanges(userToEdit)}
          />
        )}
      </div>
    </Modal>
  )
}

export default ScheduleEdit;

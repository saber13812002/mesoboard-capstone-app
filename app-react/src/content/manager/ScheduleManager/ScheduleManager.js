import { useState } from 'react'
import { MButton } from '../../../components'
import { ScheduleTable, ScheduleTurnsTable } from '../..'
import { turnArray, employeeWeekDatesArray } from '../../../constants/scheduleConstant'
import {
  Icon,
  ICON_OPTIONS,
  ScheduleEdit
} from '../../../components'


const ScheduleManager = () => {
  // const [weekDateRange, setWeekDateRange] = useState({})
  const [employeeWeekDates] = useState(employeeWeekDatesArray)
  const [turns, setTurns] = useState(turnArray)
  const [employeeToEdit, setEmployeeToEdit] = useState(null)

  // useEffect fetching the data to initialize the states

  // functions to handle schedule turns modification and schedule editing (handle state management)
  const openScheduleEdit = (employee) => {
    setEmployeeToEdit(employee)
  }

  const closeScheduleEdit = () => {
    setEmployeeToEdit(null)
  }

  const addNewTurn = () =>
    setTurns(prev => [...prev, { id: null, start: null, end: null, lunch: null }])

  const modifyWeekdayHoursByTurn = (weekdayIndex, turnIndex) => {
    if (turnIndex == null || turnIndex < 0 || turnIndex > turns.length - 1)
      return

    const { id, start, end, lunch } = turns[turnIndex]
    const newWeekday = {
      turn: id,
      startHour: start,
      endHour: end,
      mealHour: lunch
    }

    setEmployeeToEdit(emp => {
      const newEmployee = { ...emp }
      newEmployee.weekdays[weekdayIndex] = newWeekday
      return newEmployee
    })
  }

  const addWeekdayIntoList = (weekdayIndex) => {
    const newWeekday = {
      turn: 1,
      startHour: turns[1].start,
      endHour: turns[1].end,
      mealHour: turns[1].lunch
    }

    setEmployeeToEdit(emp => {
      const newEmployee = { ...emp }

      newEmployee.weekdays[weekdayIndex] = newWeekday
      return newEmployee
    })
  }

  return (
    <div>
      {/* section for the weekDateRange component and the buttons */}
      <div className='d-flex justify-content-between mb-3'>
        <div>
          Date Range
        </div>
        <div className='d-flex'>
          <MButton
            icon={ICON_OPTIONS.download}
            text='Template CSV'
            variant='outline-primary'
            className='mr-2'
            size='sm'
          />
          <MButton
            icon={ICON_OPTIONS.upload}
            text='Import CSV'
            variant='secondary'
            className='mr-2'
            size='sm'
          />
          <Icon
            icon={ICON_OPTIONS.download}
            color={'primary'}
          />
        </div>
      </div>


      {/* section for the scheduleTable and approve button */}
      <section className='mb-4'>
        <ScheduleTable onOpenScheduleEdit={openScheduleEdit} employeeWeekDates={employeeWeekDates} />
      </section>

      {/* section for the ScheduleEditModal portal component */}
      <ScheduleTurnsTable turns={turns} onAddNewTurn={addNewTurn} />

      {employeeToEdit &&
        <ScheduleEdit
          employee={employeeToEdit}
          turns={turns}
          onWeekdayHoursUpdate={modifyWeekdayHoursByTurn}
          onWeekdayAdd={addWeekdayIntoList}
          onCloseScheduleEdit={closeScheduleEdit}
        />
      }
    </div>
  )
}

export default ScheduleManager

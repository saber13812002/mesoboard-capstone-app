import { useState, useEffect } from 'react'
import { MButton } from '../../../components'
import { ScheduleTable, ScheduleTurnsTable } from '../..'
import { turnArray, employeeWeekDatesArray } from '../../../constants/scheduleConstant'
import {
  Icon,
  iconComponents,
  ScheduleEdit
} from '../../../components'
import axios from 'axios'
import { DateRange } from '../..'


const ScheduleManager = () => {
  // const [weekDateRange, setWeekDateRange] = useState({})
  const [employeeWeekDates] = useState(employeeWeekDatesArray)
  const [turns, setTurns] = useState(turnArray)
  const [employeeToEdit, setEmployeeToEdit] = useState(null)
  const [dateRange, setDateRange] = useState({ dateStart: '11/09/2021', dateEnd: '11/15/2021' })

  // useEffect fetching the data to initialize the states
  useEffect(async () => {
    const getWeekSchedule = async () => {
      console.log('fetching week schedule')
      const date = new Date()
      axios.get('/protected/schedule/week', { date }).then(res => {
        console.log('week schedule', res.data);
        console.log()
        console.log('employeeWeekDates', employeeWeekDates)

      })
        .catch(err => console.log(err))
    }
    getWeekSchedule()
    // setTimeout(() => getWeekSchedule(), 5000)
  }, [])

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
        {dateRange && (
          <DateRange />
        )}
        <div className='d-flex align-items-center'>
          <MButton
            className='mr-2'
            text='Template CSV'
            variant='outline-primary'
            size='sm'
            IconComponent={iconComponents.Download}
            iconSize='sm'
            iconColor='dark'
          />
          <MButton
            className='mr-2'
            text='Import CSV'
            variant='secondary'
            size='sm'
            IconComponent={iconComponents.Upload}
            iconSize='sm'
            iconColor='dark'
          />
          <Icon
            IconComponent={iconComponents.Download}
            size='lg'
            color='primary'
            className='mr-2'
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

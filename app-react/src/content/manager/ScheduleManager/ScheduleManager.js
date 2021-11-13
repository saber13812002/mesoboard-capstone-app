import { useState } from 'react'
import { MButton } from '../../../components'
import { ScheduleTable, ScheduleTurnsTable } from '../..'
import { turnArray, employeeWeekDatesArray } from '../../../constants/scheduleConstant'
import { timeFromInt } from 'time-number';
import {
  Icon,
  ICON_OPTIONS,
  ScheduleEdit
} from '../../../components'


const ScheduleManager = () => {
  // const [weekDateRange, setWeekDateRange] = useState({})
  const [employeeWeekDates, setEmployeeWeekDates] = useState(employeeWeekDatesArray)
  const [turns, setTurns] = useState(turnArray)
  const [employeeToEdit, setEmployeeToEdit] = useState(null)
  const [addingNewTurn, setAddingNewTurn] = useState(false)


  // useEffect fetching the data to initialize the states

  // functions to handle schedule turns modification and schedule editing (handle state management)
  const openScheduleEdit = (employee) => {
    setEmployeeToEdit(employee)
  }

  const closeScheduleEdit = () => {
    setEmployeeToEdit(null)
  }
  const onSaveTurn = (startHour,endHour,lunchHour) =>{
    console.log(startHour,endHour,lunchHour)
    setTurns(prev => {
      let turnClone = [...prev]
      const lastTurn= prev[prev.length-1]
      lastTurn.id = prev.length
      lastTurn.start =  timeFromInt(startHour, { format: 12,leadingZero: false })
      lastTurn.end =  timeFromInt(endHour, { format: 12,leadingZero: false })
      lastTurn.lunch =  timeFromInt(lunchHour, { format: 12,leadingZero: false })
      turnClone = sortTurns(turnClone)
      turnClone.forEach((turn,i)=>
      turn.id=i+1
      )
      setAddingNewTurn(false)
      
    console.log(lastTurn, timeFromInt(startHour))
      return turnClone
    })

    
  }

  
  const sortTurns = (turn) =>{
    console.log('--------------')
    const res = turn.sort((a,b)=>{
      console.log(a.start,b.start)
      return ('' + a.start).localeCompare(b.start) 
    })
    console.log(res)
    return res
  }


  const addNewTurn = () =>{
    setTurns(prev => [...prev, { id: null, start: null, end: null, lunch: null }])
    setAddingNewTurn(true)
  }

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
      <ScheduleTurnsTable turns={turns} onAddNewTurn={addNewTurn} addingNewTurn ={addingNewTurn} onSaveTurn={onSaveTurn} />

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

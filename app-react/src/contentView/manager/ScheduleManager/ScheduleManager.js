import { useState, useEffect } from 'react'
import { MButton } from '../../../components'
import { ScheduleTable, ScheduleTurnsTable } from '../..'
import { turnArray, employeeWeekDatesArray } from '../../../constants/scheduleConstant'
import { Icon, iconComponents, ScheduleEdit } from '../../../components'
import { timeFromInt } from 'time-number';
import { DateRange } from '../..'
import { getDateId } from '../../../services/scheduleService'
// import axios from 'axios'
import moment from 'moment'

const ScheduleManager = () => {
  // const [weekDateRange, setWeekDateRange] = useState({})
  // <<<<<<< HEAD
  //   const [employeeWeekDates] = useState(employeeWeekDatesArray)
  //   const [turns, setTurns] = useState(turnArray)
  //   const [employeeToEdit, setEmployeeToEdit] = useState(null)

  //   // functions to handle schedule turns modification and schedule editing (handle state management)
  //   const openScheduleEdit = employee => setEmployeeToEdit(employee)
  //   const closeScheduleEdit = () => setEmployeeToEdit(null)


  //   const addNewTurn = () =>
  //     setTurns(prev => [...prev, { id: null, start: null, end: null, lunch: null }])
  // =======
  const [employeeWeekDates, setEmployeeWeekDates] = useState(employeeWeekDatesArray)
  const [turns, setTurns] = useState(turnArray)
  const [employeeToEdit, setEmployeeToEdit] = useState(null)
  const [addingNewTurn, setAddingNewTurn] = useState(false)
  const [currentMoment, setCurrentMoment] = useState(moment())
  const [weekSchedule, setWeekSchedule] = useState([]) //array of json, at least containing id as desired

  const weekStart = currentMoment.clone().startOf('week').add(2, 'day'); //tuesday
  const weekEnd = currentMoment.clone().endOf('week').add(2, 'day'); //monday

  // console.log('moment().isoWeekday()', moment().isoWeekday())
  // console.log('moment().calendar()', moment().calendar())

  // useEffect fetching the data to initialize the states
  // useEffect fetching the data to initialize the states
  useEffect(() => {
    const week = [];
    let currentDay = weekStart.clone()
    const nextTuesday = weekEnd.clone().add(1, 'day')
    while (currentDay.isBefore(nextTuesday, 'day')) {
      week.push(currentDay.clone())
      currentDay.add(1, 'day')
    }



    const m = week[0];
    getDateId(m)
    // console.log(getDateId(m))

    console.log('week', week)
    setWeekSchedule(week)
    // const getWeekSchedule = async () => {
    //   axios.get('/protected/schedule/week', { currentMoment }).then(res => {
    //     const week = res.data
    //     console.log('week schedule', week);
    //     setWeekSchedule(week)
    //   })
    //     .catch(err => console.log(err))
    // }
    // getWeekSchedule()
  }, [currentMoment])


  /*
    {
      employeeName: 'Iris J. Ramirez',
      totalHours: 40.00,
      isHourLunch: false,
      weekSchedule: [
        {
          turn: 1,
          startHour: '6:30AM',
          endHour: '3.00PM',
          lunchHour: '11:00AM'
        },
        null,
      ]
    }
  */

  // functions to handle schedule turns modification and schedule editing (handle state management)
  const openScheduleEdit = employee => setEmployeeToEdit(employee)
  const closeScheduleEdit = () => setEmployeeToEdit(null)

  const goToPrevious = () => {
    console.log('-----', weekStart.clone().add(-7, 'day'))
    setCurrentMoment(weekStart.clone().add(-7, 'day'))
  }

  const goToNextWeek = () => {
    const TuesdayInTwoWeeks = weekEnd.clone().add(8, 'day')
    console.log('currentMoment', currentMoment)
    console.log('currentMoment.isBefore(TuesdayInTwoWeeks)', currentMoment.isBefore(TuesdayInTwoWeeks))
    if (currentMoment.isBefore(TuesdayInTwoWeeks)) {
      setCurrentMoment(weekEnd.clone().add(1, 'day'))
    }
  }

  const onSaveTurn = (hourStart, hourEnd, lunchHour) => {
    console.log(hourStart, hourEnd, lunchHour)
    setTurns(prev => {
      let turnClone = [...prev]
      const lastTurn = prev[prev.length - 1]
      lastTurn.id = prev.length
      lastTurn.start = timeFromInt(hourStart, { format: 12, leadingZero: false })
      lastTurn.end = timeFromInt(hourEnd, { format: 12, leadingZero: false })
      lastTurn.lunch = timeFromInt(lunchHour, { format: 12, leadingZero: false })
      turnClone = sortTurns(turnClone)
      turnClone.forEach((turn, i) =>
        turn.id = i + 1
      )
      setAddingNewTurn(false)

      console.log(lastTurn, timeFromInt(hourStart))
      return turnClone
    })
  }


  const sortTurns = (turn) => {
    console.log('--------------')
    const res = turn.sort((a, b) => {
      console.log(a.start, b.start)
      return ('' + a.start).localeCompare(b.start)
    })
    console.log(res)
    return res
  }

  const addNewTurn = () => {
    setTurns(prev => [...prev, { id: null, start: null, end: null, lunch: null }])
    setAddingNewTurn(true)
  }
  // >>>>>>> 64dd3c7498388095f28a3881ea8c9433a1aa68bc

  const modifyWeekdayHoursByTurn = (weekdayIndex, turnIndex) => {
    if (turnIndex == null || turnIndex < 0 || turnIndex > turns.length - 1)
      return

    const { id, start, end, lunch } = turns[turnIndex]
    const newWeekday = {
      turn: id,
      hourStart: start,
      hourEnd: end,
      hourLunch: lunch
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
      hourStart: turns[1].start,
      hourEnd: turns[1].end,
      hourLunch: turns[1].lunch
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

        {
          weekSchedule.length > 0 && (
            // <DateRange dateStart={'Nov. 9, 2021'} dateEnd={'Nov. 16, 2021'} />
            <DateRange
              dateStart={weekSchedule[0].toDate()}
              dateEnd={weekSchedule[6].toDate()}
              onGoToNextWeek={goToNextWeek}
              onGoToPrevious={goToPrevious}
            />
          )
        }
        <div className='d-flex align-items-start'>
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
      </div >


      {/* section for the scheduleTable and approve button */}
      <section className='mb-4'>
        <ScheduleTable onOpenScheduleEdit={openScheduleEdit} employeeWeekDates={employeeWeekDates} />
      </section>

      {/* section for the ScheduleEditModal portal component */}
      <ScheduleTurnsTable
        turns={turns}
        onAddNewTurn={addNewTurn}
        addingNewTurn={addingNewTurn}
        onSaveTurn={onSaveTurn}
      />
      {employeeToEdit &&
        <ScheduleEdit
          employee={employeeToEdit}
          turns={turns}
          onWeekdayHoursUpdate={modifyWeekdayHoursByTurn}
          onWeekdayAdd={addWeekdayIntoList}
          onCloseScheduleEdit={closeScheduleEdit}
        />}
    </div >
  )
}

export default ScheduleManager

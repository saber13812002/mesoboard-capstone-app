import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../../store'
import { MButton } from '../../../components'
import { ScheduleTable, TurnsTable } from '../..'
import { turnArray, employeeScheduleArray } from '../../../constants/scheduleConstant'
import { Icon, iconComponents, ScheduleEdit } from '../../../components'
import { timeFromInt } from 'time-number';
import { DateRange } from '../..'
import { getScheduleIdOfDate, getScheduleIdOfMoment } from '../../../services/scheduleService'
import { ServerRoutes as server } from '../../../services/apiService'
import axios from 'axios'
import moment from 'moment'

const m = moment()
const sunday = m.clone().isoWeekday(0)
const monday = m.clone().isoWeekday(1)
// console.log('sunday', sunday)
// console.log('monday', monday)

let startOfThisWeek = moment().clone();
let endOfThisWeek = moment().clone();

// console.log('m.isSame(sunday)', m.isSame(sunday))
// console.log('m.isSame(monday)', m.isSame(monday))
if (m.isSame(sunday)) {
  // console.log('decrementing...')
  startOfThisWeek.add(-5, 'day') //tuesday
  endOfThisWeek.add(1, 'day') //monday
}
else if (m.isSame(monday)) {
  // console.log('MONDAY decrement')
  startOfThisWeek.add(-6, 'day')
}
else {
  startOfThisWeek = moment().clone().startOf('week').add(2, 'day');
  endOfThisWeek = moment().clone().endOf('week').add(2, 'day')
}

const mondayInTwoWeeks = endOfThisWeek.clone().add(7, 'day')
// console.log('startOfThisWeek', startOfThisWeek)
// console.log('endOfThisWeek', endOfThisWeek)
// console.log('mondayInTwoWeeks', mondayInTwoWeeks)

const ScheduleManager = () => {
  // const [employeeSchedules, setEmployeeSchedules] = useState(employeeScheduleArray)
  // const [turns, setTurns] = useState(turnArray)
  const [employeeSchedules, setEmployeeSchedules] = useState([])
  const [turns, setTurns] = useState([])
  const [employeeToEdit, setEmployeeToEdit] = useState(null)
  const [addingNewTurn, setAddingNewTurn] = useState(false)
  const [weekSchedule, setWeekSchedule] = useState([]) //array of json, at least containing id as desired

  // moments
  const [mCurrent, setMCurrent] = useState(moment())
  const [mWeekStart, setMWeekStart] = useState(startOfThisWeek.clone()) //always a tuesday
  const [mWeekEnd, setMWeekEnd] = useState(endOfThisWeek.clone()) //always a monday

  // initializing week schedule dates
  useEffect(() => {
    if (mWeekStart) {
      // console.log('mWeekStart', mWeekStart)
      // console.log('mWeekEnd', mWeekEnd, '\n')
      const week = [];
      let currentDay = mWeekStart.clone()
      const nextTuesday = mWeekEnd.clone().add(1, 'day')
      // console.log('nextTuesday', nextTuesday, '\n')
      while (currentDay.isBefore(nextTuesday, 'day')) {
        week.push(currentDay.clone())
        currentDay.add(1, 'day')
      }
      // console.log('week', week)
      setWeekSchedule(week)

      const getWeekSchedule = async () => {
        const schedule_id = getScheduleIdOfMoment(mWeekStart)
        const url = server.getUserSchedule(schedule_id);
        console.log('url', url)
        axios.get(url).then(res => {
          if (res) {
            const schedules = res.data.schedules
            console.log('schedules', schedules)

            let totalHours;
            schedules.forEach(sched => {
              // convert weekDate obj to array containing each day as keys
              sched.weekDates = [0, 1, 2, 3, 4, 5, 6].map(day => sched.weekDates[day] ? sched.weekDates[day] : null)

              // calculate and set the total hours of a particular week
              totalHours = 0
              for (let dates of sched.weekDates) {
                if (dates)
                  totalHours += Math.abs(new Date(dates.dateEnd) - new Date(dates.dateStart)) / 36e5
              }
              sched['totalHours'] = totalHours
            })

            setEmployeeSchedules(schedules)
          }
        })
          .catch(err => console.log(err))
      }
      setTimeout(() => getWeekSchedule(), 2000)
      // getWeekSchedule()
    }
  }, [mCurrent])

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
    setMCurrent(currMoment => {
      const prevMoment = currMoment.clone().add(-7, 'day')
      setMWeekStart(prevMoment.clone().startOf('week').add(2, 'day'));
      setMWeekEnd(prevMoment.clone().endOf('week').add(2, 'day'))
      return prevMoment
    })
  }


  const goToNextWeek = () => {
    // console.log('')
    // console.log('')
    // console.log('')

    // console.log('-mWeekStart', mWeekStart)
    // console.log('mWeekEnd', mWeekEnd)
    // console.log('mWeekEnd.isBefore(mondayInTwoWeeks)', mWeekEnd.isBefore(mondayInTwoWeeks))
    if (mWeekEnd.isBefore(mondayInTwoWeeks)) {
      setMCurrent(currMoment => {
        console.log('mMoment', currMoment)
        const nextMoment = mWeekEnd.clone().add(1, 'day')
        console.log('nextMoment', nextMoment)
        setMWeekStart(nextMoment.clone().startOf('week').add(2, 'day'));
        setMWeekEnd(nextMoment.clone().endOf('week').add(2, 'day'))
        return nextMoment
      })
    }
  }


  const saveTurn = (hourStart, hourEnd, lunchHour) => {
    console.log('saveTurn', hourStart, hourEnd, lunchHour)
    setTurns(prev => {
      let turnClone = [...prev]
      const lastTurn = prev[prev.length - 1]
      lastTurn.start = timeFromInt(hourStart, { format: 12, leadingZero: false })
      lastTurn.end = timeFromInt(hourEnd, { format: 12, leadingZero: false })
      lastTurn.lunch = timeFromInt(lunchHour, { format: 12, leadingZero: false })

      // console.log('formatted', lastTurn.start)

      // sort by date start
      turnClone = turnClone.sort((a, b) => {
        console.log('\n\n')
        const is_a_am = a.start.includes('AM')
        const is_b_am = a.start.includes('AM')
        const is_a_pm = b.start.includes('PM')
        const is_b_pm = b.start.includes('PM')

        // do algorithm to determine order depending on AM or PM
        if (is_a_pm && is_b_am) {
          return -1
        }
        // 3 more conditions maybe
        return a.start.localeCompare(b.start)
      })

      // enumerate in desc order
      turnClone.forEach((turn, i) => turn.id = i + 1)

      setAddingNewTurn(false)
      return turnClone
    })
  }


  const addNewTurn = () => {
    setTurns(prev => [...prev, { id: null, start: null, end: null, lunch: null }])
    setAddingNewTurn(true)
  }


  /** TO BE WORKED ON
   *  update weekDate hours of the schedule edit component
   */
  const modifyWeekDateHoursByTurn = (day, turnIndex) => {
    console.log('day', day)
    console.log('turnIndex', turnIndex)
    if (turnIndex == null || turnIndex < 0 || turnIndex > turns.length - 1)
      return

    const { id, start, end, lunch } = turns[turnIndex]
    const newWeekDate = {
      turn: id,
      hourStart: start,
      hourEnd: end,
      hourLunch: lunch
    }

    setEmployeeToEdit(emp => {
      const newEmployee = { ...emp }
      newEmployee.weekDates[day] = newWeekDate
      return newEmployee
    })
  }

  /** TO BE WORKED ON */
  const addWeekDateIntoList = (day) => {
    if (turns.length > 0) {
      const newWeekDate = {
        turn: 1,
        hourStart: turns[turns.length - 1].start,
        hourEnd: turns[turns.length - 1].end,
        hourLunch: turns[turns.length - 1].lunch
      }

      setEmployeeToEdit(emp => {
        const newEmployee = { ...emp }
        newEmployee.weekDates[day] = newWeekDate
        return newEmployee
      })
    }
  }

  // console.log('weekSchedule', weekSchedule)
  return (
    <div>
      {/* section for the weekDateRange component and the buttons */}
      <div className='d-flex justify-content-between mb-3'>
        {
          (weekSchedule.length > 0) && (
            <DateRange
              dateStart={weekSchedule[0].toDate()}
              dateEnd={weekSchedule[6].toDate()}
              disableNext={!mWeekEnd.isBefore(mondayInTwoWeeks)}
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
            className='mt-1'
          />
        </div>
      </div >

      {/* section for the scheduleTable and approve button */}
      {employeeSchedules.length > 0 && (
        <section className='mb-4'>
          <ScheduleTable onOpenScheduleEdit={openScheduleEdit} employeeSchedules={employeeSchedules} />
        </section>
      )}

      {/* section for the ScheduleEditModal portal component */}
      <TurnsTable
        turns={turns}
        onAddNewTurn={addNewTurn}
        addingNewTurn={addingNewTurn}
        onSaveTurn={saveTurn}
      />
      {employeeToEdit &&
        <ScheduleEdit
          employee={employeeToEdit}
          turns={turns}
          dateStart={mWeekStart.toDate()}
          dateEnd={mWeekEnd.toDate()}
          onWeekDateHoursUpdate={modifyWeekDateHoursByTurn}
          onWeekDateAdd={addWeekDateIntoList}
          onCloseScheduleEdit={closeScheduleEdit}
        />}
    </div >
  )
}

export default ScheduleManager

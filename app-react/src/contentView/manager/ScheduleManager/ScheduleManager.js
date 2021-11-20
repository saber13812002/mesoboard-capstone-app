import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../../store'
import { MButton } from '../../../components'
import { ScheduleTable, TurnsTable } from '../..'
import { turnArray, employeeScheduleArray } from '../../../constants/scheduleConstant'
import { Icon, iconComponents, ScheduleEdit } from '../../../components'
import { timeFromInt } from 'time-number';
import { DateRange } from '../..'
import { ServerRoutes as server } from '../../../services/apiService'
import {
  getScheduleIdOfMoment,
  getTurnIdOfHour,
  get24HourFormatOfHour,
} from '../../../services/scheduleService'


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
const momentDisablePrevious = moment(new Date('2021-11-17'))

// console.log('startOfThisWeek', startOfThisWeek)
// console.log('endOfThisWeek', endOfThisWeek)
// console.log('mondayInTwoWeeks', mondayInTwoWeeks)

const ScheduleManager = () => {
  // moment.js
  const [weekSchedule, setWeekSchedule] = useState([]); // array of moments of the current week
  const [mCurrent, setMCurrent] = useState(moment()) // the current moment
  const [mWeekStart, setMWeekStart] = useState(startOfThisWeek.clone()) //always a tuesday
  const [mWeekEnd, setMWeekEnd] = useState(endOfThisWeek.clone()) //always a monday

  // employee
  const [employeeSchedules, setEmployeeSchedules] = useState([]); // array of employee with their week date schedules
  const [editingEmployee, setEditingEmployee] = useState(false); // determines if an employee is being modified
  const [editedEmployee, setEditedEmployee] = useState(undefined); // the employee with schedule to be modified

  // turns
  const [turns, setTurns] = useState([]); // the turns of this manager entity 
  const [addingNewTurn, setAddingNewTurn] = useState(false) // determines if a turn is being added
  const [newTurn, setNewTurn] = useState({ turnId: -1, hourStart: undefined }) // the new turn being created

  // context
  const { authState } = useContext(AuthContext)

  /** Initializing the manager TURNS once. */
  const userId = authState.userId;
  useEffect(() => {
    if (userId) {
      const getUserTurns = async () => {
        // console.log('authState', authState)
        // console.log('-userId', userId)
        const url = server.getUserTurns(userId);
        // console.log('url', url)
        axios.get(url)
          .then(res => {
            console.log('res.data.turns', res.data.turns)
            setTurns(res.data.turns)
          })
          .catch(err => console.log(err))
      }
      // setTimeout(() => getUserTurns(), 6000)
      getUserTurns()
    }
  }, [userId])


  /** Initializing array of EMPLOYEE schedules for the current week. */
  useEffect(() => {
    if (mWeekStart) {
      // console.log('mWeekStart', mWeekStart)
      // console.log('mWeekEnd', mWeekEnd, '\n')
      // set the schedule of the week starting with mWeekStart
      const week = [];
      let currentDay = mWeekStart.clone();
      const nextTuesday = mWeekEnd.clone().add(1, 'day')
      while (currentDay.isBefore(nextTuesday, 'day')) {
        week.push(currentDay.clone())
        currentDay.add(1, 'day')
      }
      // console.log('week', week)
      setWeekSchedule(week)

      const getWeekSchedule = async () => {
        const scheduleId = getScheduleIdOfMoment(mWeekStart)
        const url = server.getUserSchedule(scheduleId);
        // console.log('url', url)
        axios.get(url).then(res => {
          if (res.data.schedules) {
            const schedules = res.data.schedules
            // console.log('schedules', schedules)
            setEmployeeSchedules(schedules)
          }
          else setEmployeeSchedules([])
        })
          .catch(err => console.log(err))
      }
      // setTimeout(() => getWeekSchedule(), 2000)
      getWeekSchedule()
    }
  }, [mCurrent])


  /** TURN has been created. */
  useEffect(() => {
    if (!addingNewTurn && newTurn.hourStart) {
      // fetch create or update turn table
      const saveTurns = async () => {
        const turnId = getTurnIdOfHour(newTurn.hourStart)
        const { hourStart, hourEnd, hourLunch } = newTurn
        // console.log('newTurn.hourStart', newTurn.hourStart)
        // console.log('userId', userId)
        const url = server.setTurn();
        // console.log('url', url)
        // console.log('get24HourFormatOfHour(hourStart)', get24HourFormatOfHour(hourStart))
        axios.post(url, {
          user_id: userId,
          turn_id: turnId,
          hour_start: get24HourFormatOfHour(hourStart),
          hour_end: get24HourFormatOfHour(hourEnd),
          hour_lunch: get24HourFormatOfHour(hourLunch)
        })
        setNewTurn({ turnId: -1 })
        // .then(res => {
        //   console.log('reseting turn with setNewTurn')

        //   // setNewTurn({ turnId: -1 })
        // })
        // .catch(err => console.log(err))
      }
      saveTurns()
    }
  }, [turns])


  /** Saving the changes made to the schedule of a particular employee. */
  useEffect(() => {
    if (!editingEmployee && editedEmployee) {
      // console.log('editedEmployee', editedEmployee)
      const employee = employeeSchedules.find(emp => emp.userId === editedEmployee.userId);
      employee.weekDates = editedEmployee.weekDates

      // console.log('Now update the schedule of this employee on the database')
      const setUserSchedule = async () => {
        // console.log('weekDates', employee.weekDates);
        // const schedule_id = getScheduleIdOfDate(employeeSchedules[employeeIndex].weekDates[0]);
        const schedule_id = getScheduleIdOfMoment(mWeekStart);
        const user_id = employee.userId;
        const is_hour_lunch = false;

        // console.log('schedule_id', schedule_id);
        // console.log('user_id', user_id);
        const url = server.setUserSchedule(); ///protected/schedule/week
        // console.log('url', url);
        // console.log('employee.weekDates', employee.weekDates)

        axios.post(url, {
          user_id,
          schedule_id,
          is_hour_lunch,
          ...employee.weekDates
        })
          .then(res => {
            // console.log('res', res)
            // setEditedEmployee(undefined)
          })
        //   .catch(err => console.log(err))
        setEditedEmployee(undefined)
      }
      setUserSchedule()
    }
  }, [editedEmployee])


  /************************************************/
  /*              General Functions               */
  /************************************************/

  const goToPrevious = () => {
    setMCurrent(currMoment => {
      const prevMoment = currMoment.clone().add(-7, 'day')
      setMWeekStart(prevMoment.clone().startOf('week').add(2, 'day'));
      setMWeekEnd(prevMoment.clone().endOf('week').add(2, 'day'))
      return prevMoment
    })
  }

  const goToNextWeek = () => {
    // console.log('-mWeekStart', mWeekStart)
    // console.log('mWeekEnd', mWeekEnd)
    // console.log('mWeekEnd.isBefore(mondayInTwoWeeks)', mWeekEnd.isBefore(mondayInTwoWeeks))
    if (mWeekEnd.isBefore(mondayInTwoWeeks)) {
      setMCurrent(_ => {
        const nextMoment = mWeekEnd.clone().add(1, 'day')
        setMWeekStart(nextMoment.clone().startOf('week').add(2, 'day'));
        setMWeekEnd(nextMoment.clone().endOf('week').add(2, 'day'))
        return nextMoment
      })
    }
  }


  /************************************************/
  /*           Schedule Turns Functions           */
  /************************************************/

  const saveTurn = (hourStart, hourEnd, lunchHour) => {
    // console.log('saveTurn', hourStart, hourEnd, lunchHour)
    setTurns(prev => {
      let turnClone = [...prev]
      const lastTurn = prev[prev.length - 1]

      // console.log('hourStart', hourStart)
      // console.log('hourEnd', hourEnd)
      // console.log('lunchHour', lunchHour)

      lastTurn.hourStart = timeFromInt(hourStart, { format: 12, leadingZero: false })
      lastTurn.hourEnd = timeFromInt(hourEnd, { format: 12, leadingZero: false })
      lastTurn.hourLunch = timeFromInt(lunchHour, { format: 12, leadingZero: false })

      // console.log('lastTurn.start', lastTurn.hourStart)
      // console.log('lastTurn.end', lastTurn.end)
      // console.log('lastTurn.lunch', lastTurn.lunch)

      /*
        To simplify the sort, maybe you can leave the times as is (not use timeFromInt),
        and after sorting, iterate and convert with timeFromInt
      */
      // sort by date start
      turnClone = turnClone.sort((a, b) => {
        // console.log('\n\n')
        const is_a_am = a.hourStart.includes('AM')
        const is_a_pm = a.hourStart.includes('PM')
        const is_b_am = b.hourStart.includes('AM')
        const is_b_pm = b.hourStart.includes('PM')

        // do algorithm to determine order depending on AM or PM
        if (is_a_pm && is_b_am) {
          return -1
        }
        // 3 more conditions maybe
        return a.hourStart.localeCompare(b.hourStart)
      })

      // enumerate in desc order
      turnClone.forEach((turn, i) => turn.turnId = i + 1)

      // store new turn id for fetch insert on useEffect
      const turnId = getTurnIdOfHour(lastTurn.hourStart)

      console.log('lastTurn', lastTurn)
      // console.log('turnId', turnId)
      setNewTurn({
        turnId,
        hourStart: lastTurn.hourStart,
        hourEnd: lastTurn.hourEnd,
        hourLunch: lastTurn.hourLunch
      })

      setAddingNewTurn(false)
      return turnClone
    })
  }

  const removeAddedTurn = () => {
    turns.pop();
    setTurns(turns)
    setAddingNewTurn(false)
  }

  const addNewTurn = () => {
    // setTurns(prev => {
    //   const res = [...prev, { turnId: -1, hourStart: undefined, hourEnd: undefined, hourLunch: undefined }];
    //   setAddingNewTurn(true)
    //   return res
    // })
    setTurns(prev => [...prev, { turnId: -1, hourStart: undefined, hourEnd: undefined, hourLunch: undefined }])
    setAddingNewTurn(true)
  }


  /************************************************/
  /*           Schedule Edit Functions            */
  /************************************************/

  const openScheduleEdit = employee => {
    // console.log('turns.length', turns.length)
    if (turns.length > 0 && turns[turns.length - 1].turnId === -1)
      removeAddedTurn()
    setEditedEmployee(employee)
    setEditingEmployee(true)
  }


  const closeScheduleEdit = () => {
    setEditedEmployee(undefined);
    setEditingEmployee(false)
  }


  const saveScheduleOfEmployee = emp => {
    setEditingEmployee(false)
    setEditedEmployee(emp)
  }


  const addWeekDateIntoList = (day) => {
    if (turns.length > 0) {
      const newWeekDate = {
        turn: 1,
        hourStart: turns[turns.length - 1].start,
        hourEnd: turns[turns.length - 1].end,
        hourLunch: turns[turns.length - 1].lunch
      }

      setEditedEmployee(emp => {
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
              disablePrev={mWeekStart.isBefore(momentDisablePrevious)}
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
      </div>

      {/* section for the scheduleTable and approve button */}
      <section className='mb-4'>
        <ScheduleTable
          employeeSchedules={employeeSchedules}
          onOpenScheduleEdit={openScheduleEdit}
        />
      </section>

      {/* section for the ScheduleEditModal portal component */}
      <TurnsTable
        turns={turns}
        onAddNewTurn={addNewTurn}
        addingNewTurn={addingNewTurn}
        onSaveTurn={saveTurn}
        onCancel={removeAddedTurn}
      />
      {editingEmployee &&
        <ScheduleEdit
          employee={editedEmployee}
          turns={turns}
          dateStart={mWeekStart.toDate()}
          dateEnd={mWeekEnd.toDate()}
          onWeekDateAdd={addWeekDateIntoList}
          onSaveChanges={modifiedEmp => saveScheduleOfEmployee(modifiedEmp)}
          onCloseScheduleEdit={closeScheduleEdit}
        />}
    </div >
  )
}

export default ScheduleManager

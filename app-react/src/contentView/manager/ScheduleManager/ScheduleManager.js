import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../../store'
import { MButton } from '../../../components'
import { ProfileScheduleDetails, ScheduleTable, TurnsTable } from '../..'
import { Icon, iconComponents, ScheduleEdit } from '../../../components'
import { timeFromInt } from 'time-number';
import { DateRange } from '../..'
import { ServerRoutes as server } from '../../../services/apiService'
import {
  getScheduleIdOfMoment,
  getTurnIdByTime,
  get24HourFormatOfTime
} from '../../../services/scheduleService'


const m1 = moment()
const m2 = moment()
const sunday = m1.clone().startOf('week')
const monday = m2.clone().startOf('week').add(1, 'day')
// console.log('sunday', sunday)moment()
// console.log('monday', monday)
// console.log('m1.isSame(sunday)', m1.isSame(sunday, 'date'))

let startOfThisWeek = moment().clone();
let endOfThisWeek = moment().clone();
if (m1.isSame(sunday, 'date')) {
  // console.log('decrementing...')
  startOfThisWeek.add(-5, 'day') //tuesday
  endOfThisWeek.add(1, 'day') //monday
}
else if (m2.isSame(monday, 'date')) {
  // console.log('MONDAY decrement')
  startOfThisWeek.add(-6, 'day')
}
else {
  startOfThisWeek = moment().clone().startOf('week').add(2, 'day');
  endOfThisWeek = moment().clone().endOf('week').add(2, 'day')
}

const mondayInTwoWeeks = endOfThisWeek.clone().add(7, 'day');
// console.log('startOfThisWeek', startOfThisWeek)
// console.log('endOfThisWeek', endOfThisWeek)
// console.log('mondayInTwoWeeks', mondayInTwoWeeks)

// the last week that data was added to the database. (a moment before a tuesday)
const momentDisablePrevious = moment(new Date('2021-11-15'));

const ScheduleManager = () => {
  // moment.js
  const [weekSchedule, setWeekSchedule] = useState([]); // array of moments of the current week
  const [mCurrent, setMCurrent] = useState(moment()) // the current moment
  const [mWeekStart, setMWeekStart] = useState(startOfThisWeek.clone()) //always a tuesday
  const [mWeekEnd, setMWeekEnd] = useState(endOfThisWeek.clone()) //always a monday

  // employee
  const [employees, setEmployees] = useState([]); // array of employee with their week date schedules
  const [employeeDetails, setEmployeeDetails] = useState(undefined); // the employee to show schedule details
  const [editingEmployee, setEditingEmployee] = useState(false); // determines if an employee is being modified
  const [employeeToEdit, setEmployeeToEdit] = useState(undefined); // the employee with schedule to be modified

  // turns
  const [turns, setTurns] = useState([]); // the turns of this manager entity 
  const [addingNewTurn, setAddingNewTurn] = useState(false) // determines if a turn is being added
  const [newTurn, setNewTurn] = useState({ turnId: -1, timeStart: undefined }) // the new turn being created

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
        axios.get(url).then(res => {
          // console.log('res.turns', res.data.turns)
          setTurns(res.data.turns);
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
      // console.log('turns', turns)
      // console.log('mWeekEnd', mWeekEnd, '\n')
      // set the schedule of the week starting with mWeekStart
      const week = [];
      let currentDay = mWeekStart.clone();
      const nextTuesday = mWeekEnd.clone().add(1, 'day');
      while (currentDay.isBefore(nextTuesday, 'day')) {
        // console.log('currentDay', currentDay)
        week.push(currentDay.clone());
        currentDay.add(1, 'day');
      }
      // console.log('week', week);
      setWeekSchedule(week);

      const getWeekSchedule = async () => {
        const scheduleId = getScheduleIdOfMoment(mWeekStart);
        const url = server.getUserSchedule(scheduleId);
        // console.log('url', url)
        axios.get(url).then(res => {
          if (res.data.schedules) {
            const schedules = res.data.schedules;
            console.log('res.schedules', schedules);
            // const scheduleArr = schedules.map(sched => {
            // const tr = sched.weekDates.find(weekDate => turns.turnId === weekDate.turnId);
            // const tr = turns.find(turn => turn.turnId === sched.weekDates.turnId);

            // console.log('tr', tr)
            // sched.turnIndex = tr
            //   return sched
            // })
            // turns.find(turn => turn.turnId === date.turnId).turnIndex
            // turnArr.map(turn => console.log(turn))
            setEmployees(schedules);
          }
          else setEmployees([]);
        })
          .catch(err => console.log(err))
      }
      // setTimeout(() => getWeekSchedule(), 2000)
      getWeekSchedule();
    }
  }, [mCurrent])


  /** TURN has been created. */
  useEffect(() => {
    if (!addingNewTurn && newTurn.timeStart) {
      // fetch create or update turn table
      const saveTurns = async () => {
        const turnId = getTurnIdByTime(newTurn.timeStart)
        const { timeStart, timeEnd, timeLunch } = newTurn
        // console.log('newTurn.timeStart', newTurn.timeStart)
        // console.log('userId', userId)
        const url = server.setTurn();
        // console.log('url', url)
        // console.log('get24HourFormatOfTime(timeStart)', get24HourFormatOfTime(timeStart))
        axios.post(url, {
          user_id: userId,
          turn_id: turnId,
          time_start: get24HourFormatOfTime(timeStart),
          time_end: get24HourFormatOfTime(timeEnd),
          time_lunch: get24HourFormatOfTime(timeLunch)
        })
        setNewTurn({ turnId: -1 });
      }
      saveTurns()
    }
  }, [turns])


  /** Saving the changes made to the schedule of a particular employee. */
  useEffect(() => {
    if (!editingEmployee && employeeToEdit) {
      console.log('employeeToEdit', employeeToEdit)
      // set new properties of the employee state
      let employee = employees.find(emp => emp.userId === employeeToEdit.userId);
      employee.weekDates = employeeToEdit.weekDates;
      employee.turnId = employeeToEdit.turnId;
      console.log('employee', employee);

      // console.log('Now update the schedule of this employee on the database')
      const setUserSchedule = async () => {
        // console.log('weekDates', employee.weekDates);
        // const schedule_id = getScheduleIdOfDate(employees[employeeIndex].weekDates[0]);
        const schedule_id = getScheduleIdOfMoment(mWeekStart);
        const user_id = employee.userId;
        const turn_id = employee.turnId;
        const is_hour_lunch = false;


        // console.log('schedule_id', schedule_id);
        // console.log('user_id', user_id);
        const url = server.setUserSchedule(); ///protected/schedule/week
        // console.log('url', url);
        // console.log('employee.weekDates', employee.weekDates)

        axios.post(url, {
          user_id,
          schedule_id,
          turn_id,
          is_hour_lunch,
          ...employee.weekDates
        })
        setEmployeeToEdit(undefined)
      }
      setUserSchedule()
    }
  }, [employeeToEdit])


  /************************************************/
  /*              General Functions               */
  /************************************************/

  const goToPrevious = () => {
    const oneWeekEarlier = mWeekStart.clone().add(-6, 'day'); //a moment of the previous week
    // const newWeekStart = mWeekStart.clone().add(-7, 'day');
    // console.log('oneWeekEarlier', oneWeekEarlier)
    // console.log('oneWeekEarlier.clone().startOf(week).add(2, day)', oneWeekEarlier.clone().startOf('week').add(2, 'day'))
    setMWeekStart(oneWeekEarlier.clone().startOf('week').add(2, 'day'));
    setMWeekEnd(oneWeekEarlier.clone().endOf('week').add(2, 'day'))
    setMCurrent(oneWeekEarlier)
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

  const saveTurn = (timeStart, timeEnd, lunchHour) => {
    // console.log('saveTurn', timeStart, timeEnd, lunchHour)
    setTurns(prev => {
      let turnClone = [...prev]
      const lastTurn = prev[prev.length - 1]

      // console.log('timeStart', timeStart)
      // console.log('timeEnd', timeEnd)
      // console.log('lunchHour', lunchHour)

      lastTurn.timeStart = timeFromInt(timeStart, { format: 12, leadingZero: false })
      lastTurn.timeEnd = timeFromInt(timeEnd, { format: 12, leadingZero: false })
      lastTurn.timeLunch = timeFromInt(lunchHour, { format: 12, leadingZero: false })

      // console.log('lastTurn.start', lastTurn.timeStart)
      // console.log('lastTurn.end', lastTurn.end)
      // console.log('lastTurn.lunch', lastTurn.lunch)

      /*
        To simplify the sort, maybe you can leave the times as is (not use timeFromInt),
        and after sorting, iterate and convert with timeFromInt
      */
      // sort by date start
      turnClone = turnClone.sort((a, b) => {
        // console.log('\n\n')
        const is_a_am = a.timeStart.includes('AM')
        const is_a_pm = a.timeStart.includes('PM')
        const is_b_am = b.timeStart.includes('AM')
        const is_b_pm = b.timeStart.includes('PM')

        // do algorithm to determine order depending on AM or PM
        if (is_a_pm && is_b_am) {
          return -1
        }
        // 3 more conditions maybe
        return a.timeStart.localeCompare(b.timeStart)
      })

      // enumerate in desc order
      turnClone.forEach((turn, i) => turn.turnIndex = i + 1)

      // store new turn id for fetch insert on useEffect
      const turnIndex = getTurnIdByTime(lastTurn.timeStart)

      console.log('lastTurn', lastTurn)
      // console.log('turnId', turnId)
      setNewTurn({
        turnIndex,
        turnId: getTurnIdByTime(lastTurn.timeStart),
        timeStart: lastTurn.timeStart,
        timeEnd: lastTurn.timeEnd,
        timeLunch: lastTurn.timeLunch
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
    //   const res = [...prev, { turnId: -1, timeStart: undefined, timeEnd: undefined, timeLunch: undefined }];
    //   setAddingNewTurn(true)
    //   return res
    // })
    setTurns(prev => [...prev, { turnIndex: -1, timeStart: undefined, timeEnd: undefined, timeLunch: undefined }])
    setAddingNewTurn(true)
  }


  /************************************************/
  /*           Schedule Edit Functions            */
  /************************************************/

  const openScheduleDetails = employee => {
    setEmployeeDetails(employee)
    // setShowEmployeeDetails(true)
  }

  const openScheduleEdit = employee => {
    // console.log('turns.length', turns.length)
    if (turns.length > 0 && turns[turns.length - 1].turnId === -1)
      removeAddedTurn()
    setEmployeeToEdit(employee)
    setEditingEmployee(true)
  }

  const closeScheduleEdit = () => {
    setEmployeeToEdit(undefined);
    setEditingEmployee(false)
  }

  const saveScheduleOfEmployee = emp => {
    setEditingEmployee(false)
    setEmployeeToEdit(emp)
  }

  // console.log('mCurrent', mCurrent)
  return (
    <>
      {employeeDetails && (
        <ProfileScheduleDetails
          employee={employeeDetails}
          onBack={() => setEmployeeDetails(undefined)}
        />
      )}
      {!employeeDetails && <>
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

        <section className='mb-4'>
          <ScheduleTable
            employees={employees}
            onOpenScheduleEdit={openScheduleEdit}
            onOpenScheduleDetails={openScheduleDetails}
          />
        </section>

        <TurnsTable
          turns={turns}
          onAddNewTurn={addNewTurn}
          addingNewTurn={addingNewTurn}
          onSaveTurn={saveTurn}
          onCancel={removeAddedTurn}
        />

        {/* section for the ScheduleEditModal portal component */}
        {editingEmployee &&
          <ScheduleEdit
            turns={turns}
            dateStart={mWeekStart.toDate()}
            dateEnd={mWeekEnd.toDate()}
            employee={employeeToEdit}
            mCurrent={mCurrent}
            onSaveChanges={modifiedEmp => saveScheduleOfEmployee(modifiedEmp)}
            onCloseScheduleEdit={closeScheduleEdit}
          />}
      </>}
    </>
  )
}

export default ScheduleManager

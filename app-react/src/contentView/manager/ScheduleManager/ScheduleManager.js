import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../../store'
import { MButton } from '../../../components'
import { ProfileScheduleDetails, ScheduleTable, TurnsTable } from '../..'
import { Icon, iconComponents, ScheduleEdit } from '../../../components'
import { timeFromInt,timeToInt } from 'time-number';
import { DateRange } from '../..'
import { ServerRoutes as server } from '../../../services/apiService'
import {
  getScheduleIdOfMoment,
  getTurnIdByTime,
  get24HourFormatOfTime,
  calculateTotalHours
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
// const momentDisablePrevious = moment(new Date('2021-11-15'));
const momentDisablePrevious = moment();

const ScheduleManager = () => {
  // moment.js
  const [weekSchedule, setWeekSchedule] = useState([]); // array of moments of the current week
  const [mCurrent, setMCurrent] = useState(moment()) // the current moment
  const [mWeekStart, setMWeekStart] = useState(startOfThisWeek.clone()) //always a tuesday
  const [mWeekEnd, setMWeekEnd] = useState(endOfThisWeek.clone()) //always a monday

  // users
  const [users, setUsers] = useState([]); // array of users with their week date schedules
  const [userDetails, setUserDetails] = useState(undefined); // the user to show schedule details
  const [editingUser, setEditingUser] = useState(false); // determines if an user is being modified
  const [userToEdit, setUserToEdit] = useState(undefined); // the user with schedule to be modified

  // turns
  const [turns, setTurns] = useState([]); // the turns of this manager entity 
  const [addingNewTurn, setAddingNewTurn] = useState(false) // determines if a turn is being added
  const [newTurn, setNewTurn] = useState({ turnId: -1, timeStart: undefined }) // the new turn being created

  // context
  const { authState } = useContext(AuthContext)

  /** Initializing the manager TURNS once. */
  const userId = authState.userId;
  useEffect(() => {
    const getUserTurns = async () => {
      const url = server.getUserTurns();
      axios.get(url).then(res => {
        // console.log('res.turns', res.data.turns)
        setTurns(res.data.turns);
      })
        .catch(err => console.log(err))
    }
    // setTimeout(() => getUserTurns(), 6000)
    getUserTurns()
  }, [])


  /** Initializing array of USER schedules for the current week. */
  useEffect(() => {
    if (!mWeekStart) return;

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
        if (res.data.userSchedulesData) {
          const userSchedulesData = res.data.userSchedulesData;
          // console.log('res.userSchedulesData', userSchedulesData);
          setUsers(userSchedulesData);
        }
        else setUsers([]);
      })
        .catch(err => console.log(err))
    }
    // setTimeout(() => getWeekSchedule(), 2000)
    getWeekSchedule();
  }, [mCurrent])


  /** TURN has been created. */
  useEffect(() => {
    if (addingNewTurn || !newTurn.timeStart) return;

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
  }, [turns])


  /** Saving the changes made to the schedule of a particular user. */
  useEffect(() => {
    if (editingUser || !userToEdit) return;

    console.log('userToEdit', userToEdit)
    // set new properties of the user state
    let user = users.find(emp => emp.userId === userToEdit.userId);
    user.weekDates = userToEdit.weekDates;
    user.turnId = userToEdit.turnId;
    console.log('user', user);

    // console.log('Now update the schedule of this user on the database')
    const setUserSchedule = async () => {
      // console.log('weekDates', user.weekDates);
      // const schedule_id = getScheduleIdOfDate(users[userIndex].weekDates[0]);
      const schedule_id = getScheduleIdOfMoment(mWeekStart);
      const user_id = user.userId;
      const is_hour_lunch = false;

      // console.log('schedule_id', schedule_id);
      // console.log('user_id', user_id);
      const url = server.setUserSchedule(); ///protected/schedule/week
      // console.log('url', url);
      // console.log('user.weekDates', user.weekDates)

      axios.post(url, {
        user_id,
        schedule_id,
        is_hour_lunch,
        ...user.weekDates
      }).then(res => {
        const newWeekDates = res.data.newWeekDates;
        user.totalHours = calculateTotalHours(newWeekDates);
        console.log('res.data.newWeekDates', res.data.newWeekDates, user.totalHours);
        setUserToEdit(undefined);
      })
    }
    setUserSchedule()
  }, [userToEdit])


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
      turnClone = sortTurns(turnClone)
      /* turnClone.sort((a, b) => {
        // console.log('\n\n')
        let aHour = timeToInt(a.timeStart)
        let bHour = timeToInt(b.timeStart)
        console.log(aHour, bHour)
        return ('' + aHour).localeCompare(bHour)
      })
 */
      // enumerate in desc order
      //turnClone.forEach((turn, i) => turn.turnIndex = i + 1)

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
  const sortTurns = (turns) => {
     turns = turns.sort((a, b) => {
        let aHour = timeToInt(a.timeStart)
        let bHour = timeToInt(b.timeStart)
        console.log(aHour, bHour)
        return ('' + aHour).localeCompare(bHour)
    })
    turns.forEach((turn, i) => turn.turnIndex = i + 1)
    //console.log(turn)
    return turns
  }
  const deleteTurn = (turnId) => {
    if(addingNewTurn){return;}
    setTurns(prev => {
      let turnClone = [...prev]      
      turnClone.splice(turnId-1, 1);
      //turnClone = sortTurns(turnClone)
      turnClone.forEach((turn, i) =>
      turn.id = i+1) 
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

  const openScheduleDetails = user => {
    setUserDetails(user)
    // setShowUserDetails(true)
  }

  const openScheduleEdit = user => {
    // console.log('turns.length', turns.length)
    if (turns.length > 0 && turns[turns.length - 1].turnId === -1)
      removeAddedTurn();
    setUserToEdit(user);
    setEditingUser(true);
  }

  const closeScheduleEdit = () => {
    setUserToEdit(undefined);
    setEditingUser(false);
  }

  const saveScheduleOfUser = emp => {
    setEditingUser(false);
    setUserToEdit(emp);
  }

  // console.log('mCurrent', mCurrent)
  return (
    <>
      {userDetails && (
        <ProfileScheduleDetails
          userScheduleData={userDetails}
          mCurrent={mCurrent}
          weekStartMoment={mWeekStart}
          onBack={() => setUserDetails(undefined)}
        />
      )}
      {!userDetails && <>
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
            users={users}
            onOpenScheduleEdit={openScheduleEdit}
            onOpenScheduleDetails={openScheduleDetails}
            isEditable={turns.length > 0 && turns[0].turnIndex > 0}
          />
        </section>

        <TurnsTable
          turns={turns}
          onAddNewTurn={addNewTurn}
          addingNewTurn={addingNewTurn}
          onSaveTurn={saveTurn}
          onCancel={removeAddedTurn}
          deleteTurn={deleteTurn}
        />

        {/* section for the ScheduleEditModal portal component */}
        {editingUser &&
          <ScheduleEdit
            turns={turns}
            dateStart={mWeekStart.toDate()}
            dateEnd={mWeekEnd.toDate()}
            user={userToEdit}
            mCurrent={mCurrent}
            onSaveChanges={modifiedEmp => saveScheduleOfUser(modifiedEmp)}
            onCloseScheduleEdit={closeScheduleEdit}
          />}
      </>}
    </>
  )
}

export default ScheduleManager

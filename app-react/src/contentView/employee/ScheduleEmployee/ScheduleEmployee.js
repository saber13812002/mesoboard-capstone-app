import { useState, useEffect } from 'react'
import { ServerRoutes as server } from '../../../services/apiService';
import { getScheduleIdOfMoment } from '../../../services/scheduleService';
import { ProfileScheduleDetails } from '../..'
import axios from 'axios';
import moment from 'moment';

const m1 = moment().clone();
const m2 = moment().clone();
const sunday = m1.clone().startOf("week");
const monday = m2.clone().startOf("week").add(1, "day");

// console.log('m1', m1)
// console.log('m2', m2)
// console.log('m1.isSame(sunday, date)', m1.isSame(sunday, 'date'))
// console.log('m2.isSame(monday, date)', m2.isSame(monday, 'date'))

// console.log('sunday', sunday)moment()
// console.log('monday', monday)

let startOfThisWeek = moment().clone();
let endOfThisWeek = moment().clone();
if (m1.isSame(sunday, "date")) {
  // console.log('decrementing...')
  startOfThisWeek.add(-5, "day"); //tuesday
  endOfThisWeek.add(1, "day"); //monday
} else if (m2.isSame(monday, "date")) {
  // console.log('MONDAY decrement')
  startOfThisWeek.add(-6, "day");
} else {
  startOfThisWeek = moment().clone().startOf("week").add(2, "day");
  endOfThisWeek = moment().clone().endOf("week").add(2, "day");
}



const ScheduleEmployee = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const schedule_id = getScheduleIdOfMoment(startOfThisWeek);
    axios.get(server.getUserSchedule(schedule_id)).then(res => {
      // console.log('res.data.userSchedulesData', res.data.userSchedulesData);
      if (res.data.userSchedulesData) {
        const userSchedulesData = res.data.userSchedulesData;
        console.log('res.userSchedulesData', userSchedulesData);
        setUsers(userSchedulesData);
      } else setUsers([]);
    })
  }, []);

  // const ProfileScheduleDetails = ({ userScheduleData, onBack }) => {


  return (
    <div>
      <ProfileScheduleDetails userScheduleData={users} onBack={() => setUsers([])} />
    </div>
  )
}

export default ScheduleEmployee

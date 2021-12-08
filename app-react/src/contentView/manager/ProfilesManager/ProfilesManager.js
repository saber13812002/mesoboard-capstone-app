import './ProfilesManager.css';
import { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import { ProfileScheduleDetails } from '../..';
import { ServerRoutes as server } from '../../../services/apiService';
import { getScheduleIdOfMoment } from '../../../services/scheduleService';


const m1 = moment()
const m2 = moment()
const sunday = m1.clone().startOf('week')
const monday = m2.clone().startOf('week').add(1, 'day')
// console.log('m1', m1)
// console.log('m2', m2)
// console.log('m1.isSame(sunday, date)', m1.isSame(sunday, 'date'))
// console.log('m2.isSame(monday, date)', m2.isSame(monday, 'date'))


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
  // console.log('ELSE')
  startOfThisWeek = moment().clone().startOf('week').add(2, 'day');
  endOfThisWeek = moment().clone().endOf('week').add(2, 'day')
}


let columns = [];

const ProfilesManager = () => {
  const [mCurrent,] = useState(moment()) // the current moment
  const [mWeekStart,] = useState(startOfThisWeek.clone()) //always a tuesday
  // const [mWeekEnd,] = useState(endOfThisWeek.clone()) //always a monday

  const [profileDetails, setProfileDetails] = useState({});
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    columns = [{
      dataField: 'name',
      text: 'Nombre Completo',
      sort: true,
      // formatter: (cell, row) => profiles[cell]
      classes: 'nameTd',
      formatter: (name, data) => <span className='name' onClick={() => setProfileDetails(data)}>{name}</span>
    },
    // {
    //   dataField: 'accumulatedHours',
    //   text: 'Horas Acumuladas',
    //   sort: true,
    //   headerAlign: 'center',
    //   align: 'center',
    //   formatter: assignedHour =>
    //     <span className='accumulatedHours'>
    //       {(assignedHour === null) ? 'calculating...' : assignedHour}
    //     </span>
    // }, 
    {
      dataField: 'totalHours',
      text: 'Horas Asignadas',
      sort: true,
      headerAlign: 'center',
      align: 'center',
    }];

    const getAllProfiles = () => {
      // axios.get(server.getAllEmployees()).then(res => {
      //   console.log('res.data.employees', res.data.employees)
      const scheduleId = getScheduleIdOfMoment(mWeekStart);
      const url = server.getUsersWithSchedule(scheduleId);
      axios.get(url).then(res => {
        setProfiles(res.data.userSchedulesData);
        // const prefilesArr = res.data.userSchedulesData;
        // calculateAccumulatedHours(prefilesArr);
        // console.log('prefilesArr', prefilesArr)
        // setProfiles(prefilesArr);
      })
    }
    getAllProfiles();
  }, [])

  // console.log('profiles', profiles);
  return (
    <>
      {(Object.keys(profileDetails).length > 0) ? (
        <ProfileScheduleDetails userScheduleData={profileDetails} currentMoment={mCurrent} weekStartMoment={mWeekStart} onBack={() => setProfileDetails({})} />
      ) : (
        <div className='profilesManager'>
          {(profiles.length > 0 && columns.length > 0) && <BootstrapTable responsive bootstrap4 bordered={false} keyField='name' data={profiles} columns={columns} />}
        </div>
      )}
    </>
  )
}

export default ProfilesManager

import { useState, useEffect } from 'react'
import './ProfilesManager.css';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
// import { iconComponents, MButton } from '../../../components';
import { ServerRoutes as server } from '../../../services/apiService';
import { getScheduleIdOfMoment } from '../../../services/scheduleService';
import moment from 'moment';
import { ProfileScheduleDetails } from '../..';


const m1 = moment()
const m2 = moment()
const sunday = m1.clone().startOf('week')
const monday = m2.clone().startOf('week').add(1, 'day')

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


let columns = [];

const ProfilesManager = () => {
  const [mCurrent, setMCurrent] = useState(moment()) // the current moment
  const [mWeekStart, setMWeekStart] = useState(startOfThisWeek.clone()) //always a tuesday

  const [profileDetails, setProfileDetails] = useState({});
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    columns = [{
      dataField: 'name',
      text: 'Nombre Completo',
      sort: true,
      // formatter: (cell, row) => profiles[cell]
      classes: 'nameTd',
      formatter: (name, data) => <p className='name' onClick={() => setProfileDetails(data)}>{name}</p>
    }, {
      dataField: 'assigned_hours',
      text: 'Horas Acumuladas',
      sort: true,
      headerAlign: 'center',
      align: 'center',
    }, {
      dataField: 'totalHours',
      text: 'Horas Asignadas',
      sort: true,
      headerAlign: 'center',
      align: 'center',
    }];

    console.log('useEffect')
    const getAllProfiles = () => {
      // axios.get(server.getAllEmployees()).then(res => {
      //   console.log('res.data.employees', res.data.employees)
      const scheduleId = getScheduleIdOfMoment(mWeekStart);
      const url = server.getUsersWithSchedule(scheduleId);
      axios.get(url).then(res => {
        console.log('res.data.userSchedulesData', res.data.userSchedulesData)
        setProfiles(res.data.userSchedulesData)
      })
    }
    getAllProfiles();
  }, [])

  // const openScheduleDetails = () => {
  //   setAddingNewPermission(false)
  // }

  // const handleAddNewPermission = () => {
  //   setAddingNewPermission(true)
  // }

  console.log('profiles', profiles, profiles.length > 0);

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

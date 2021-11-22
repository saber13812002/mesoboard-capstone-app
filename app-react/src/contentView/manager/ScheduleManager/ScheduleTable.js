import './ScheduleTable.css'
import { Table } from 'react-bootstrap'
import { ScheduleHoursBox } from '../..';
import { iconComponents, MButton } from '../../../components'

const tableHeaders = ['Employee', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Total Hours']

const ScheduleTable = ({ employees, onOpenScheduleEdit }) => {
  // console.log('employees', employees)
  /** Displays the employee schedule hours for each day of the week within one row.
   * @param scheduleInfo schedule information of a particular employee
   */
  const handleRow = (scheduleInfo, key) => {
    const { employeeName, weekDates, totalHours } = scheduleInfo;

    /** Array of weekDate objects where the indexes represent the day in number form. */
    // let weekDatesArr = [0, 1, 2, 3, 4, 5, 6].map(day => weekDates[day] ? weekDates[day] : null)

    return (
      <tr key={employeeName}>
        <td className='employeeNameTd'>
          <p className='employeeName' onClick={() => onOpenScheduleEdit(scheduleInfo)}>
            {employeeName}
          </p>
        </td>
        {(window.innerWidth > 1080) && weekDates.map((weekDate, i) => weekDate
          ? (
            <td key={key + i} className='hoursBox'>
              <ScheduleHoursBox weekDate={weekDate} />
            </td>
          )
          : <td key={i}></td>
        )}
        {(weekDates.length === 0) && [0, 1, 2, 3, 4, 5, 6].map(i => <td key={i}></td>)}
        <td className='totalHours'>{totalHours}</td>
      </tr>
    )
  }

  // console.log('employees', employees)
  return (
    <div className='scheduleTable'>
      <Table responsive size="sm" className='scheduleTable__table'>
        <thead>
          <tr>
            {(window.innerWidth > 1080) ? (
              tableHeaders.map(header => (<th key={header}>{header}</th>))
            ) : <>
              <th>{tableHeaders[0]}</th>
              <th>{tableHeaders[tableHeaders.length - 1]}</th>
            </>}
          </tr>
        </thead>
        <tbody>
          {employees.map((schedule, i) => handleRow(schedule, i))}
          {/* <tr>
            <td>
              <MButton
                IconComponent={iconComponents.CheckMark}
                iconSize='sm'
                text='Approve'
                variant='primary'
                size='sm'
                className='ml-2 mt-3 mb-2'
              />
            </td>
          </tr> */}
        </tbody>
      </Table>
    </div>
  )
}

export default ScheduleTable

import './ScheduleTable.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { ScheduleHoursBox } from '../..';
import { iconComponents, MButton } from '../../../components'

const tableHeaders = ['Employee', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Total Hours']

const ScheduleTable = ({ employeeSchedules, onOpenScheduleEdit }) => {
  /** Displays the employee schedule hours for each day of the week within one row.
   * @param scheduleInfo schedule information of a particular employee
   */
  const handleRow = (scheduleInfo, key) => {
    const { employeeName, weekDates, totalHours } = scheduleInfo

    /** Array of weekDate objects where the indexes represent the day in number form. */
    // let weekDatesArr = [0, 1, 2, 3, 4, 5, 6].map(day => weekDates[day] ? weekDates[day] : null)

    return (
      <Tr key={key}>
        <Td className='employeeNameTd' onClick={() => onOpenScheduleEdit(scheduleInfo)}>
          <p className='employeeName'>
            {employeeName}
          </p>
        </Td>
        {weekDates.map(weekDate => weekDate
          ? (
            <Td key={key} className='hours'>
              <ScheduleHoursBox weekDate={weekDate} />
            </Td>
          )
          : <Td key={key}></Td>
        )}
        <Td className='totalHours'>{totalHours}</Td>
      </Tr>
    )
  }

  // console.log('employeeSchedules', employeeSchedules)
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            {tableHeaders.map((header, i) => (<Th key={i}>{header}</Th>))}
          </Tr>
        </Thead>
        <Tbody>
          {employeeSchedules.map((schedule, i) => handleRow(schedule, i))}
          <Tr>
            <Td>
              <MButton
                IconComponent={iconComponents.CheckMark}
                iconSize='sm'
                text='Approve'
                variant='primary'
                size='sm'
                className='mt-3 mb-2'
              />
            </Td>
            {/* {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <Td key={i}></Td>)} */}
          </Tr>
        </Tbody>
      </Table>
      {/* <div className='ml-1 pt-2' style={{ marginTop: '-48px' }}>
        <MButton
          IconComponent={iconComponents.CheckMark}
          iconSize='sm'
          text='Approve'
          variant='primary'
          className='mt-3 ml-1 mb-2'
          size='sm'
        />
      </div> */}
    </>
  )
}

export default ScheduleTable

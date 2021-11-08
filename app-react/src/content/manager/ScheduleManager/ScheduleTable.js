import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { ScheduleHoursBox } from '../..';
import './ScheduleTable.css'
import { MButton, ICON_OPTIONS } from '../../../components'

const tableHeaders = ['Employee', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Total Hours']

const ScheduleTable = ({ employeeWeekDates, onOpenScheduleEdit }) => {

  const handleHourColumn = (weekday, key) => {
    return (
      <Td key={key} className='hours'>
        <ScheduleHoursBox weekday={weekday} />
      </Td>
    )
  }


  const handleRow = (employeeWeekInfo, key) => {
    // const { startHour, endHour, lunchHour, isHourLunch } = employeeWeekInfo.tuesday
    return (
      <Tr key={key} onClick={() => onOpenScheduleEdit(employeeWeekInfo)}>
        <Td className='employeeName'>{employeeWeekInfo.employeeName}</Td>
        {employeeWeekInfo.weekdays.map((weekday) => {
          if (weekday) {
            return handleHourColumn(weekday, key)
          }
          return <Td></Td>
        })}
        <Td className='totalHours'>{employeeWeekInfo.totalHours}</Td>
      </Tr>
    )
  }

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            {tableHeaders.map((header, i) => (<Th key={i}>{header}</Th>))}
          </Tr>
        </Thead>
        <Tbody>
          {employeeWeekDates.map((employeeWeekInfo, i) => (handleRow(employeeWeekInfo, i)))}
        </Tbody>
        <MButton
          icon={ICON_OPTIONS.check}
          text='Approve'
          variant='primary'
          className='mt-3 ml-1 mb-2'
          size='sm'
        />
      </Table>
    </>
  )
}

export default ScheduleTable

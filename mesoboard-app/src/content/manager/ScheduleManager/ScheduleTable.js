import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './ScheduleTable.css'

const tableHeaders = ['Employee', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Total Hours']

const ScheduleTable = () => {
  const employeeWeekDates = [
    {
      employeeName: 'Iris J. Ramirez',
      totalHours: 40.00,
      weekDays: [
        {
          startHour: '6:30AM',
          endHour: '3.00PM',
          mealHour: '11:00AM'
        },
        {},
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {},
        {},
        {},
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
      ],
      // tuesday: {
      //   startHour: '6:30AM',
      //   endHour: '3.00PM',
      //   mealHour: '11:00AM'
      // },
      // wednesday: {
      //   startHour: '6:30AM',
      //   endHour: '3.00PM',
      //   mealHour: '11:00AM'
      // },
      // thursday:   { _asAbove_ },
      // friday:     { _asAbove_ },
      // saturday:   { _asAbove_ },
      // sunday:     { _asAbove_ },
      // monday:     { _asAbove_ },
      isHourMeal: false
    },
    {
      employeeName: 'Iris J. Ramirez',
      totalHours: 32.00,
      weekDays: [
        {
          startHour: '6:30AM',
          endHour: '3.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
        {
          startHour: '16:30AM',
          endHour: '13.00PM',
          mealHour: '11:00AM'
        },
      ],
      // tuesday: {
      //   startHour: '6:30AM',
      //   endHour: '3.00PM',
      //   mealHour: '11:00AM'
      // },
      // wednesday: {
      //   startHour: '6:30AM',
      //   endHour: '3.00PM',
      //   mealHour: '11:00AM'
      // },
      // thursday:   { _asAbove_ },
      // friday:     { _asAbove_ },
      // saturday:   { _asAbove_ },
      // sunday:     { _asAbove_ },
      // monday:     { _asAbove_ },
      isHourMeal: false
    }
  ]

  // <Td className='employeeName'>{empleyeeInfo.employeeName}</Td>

  const handleHourColumn = (startHour, endHour, mealHour, isHourMeal) => {
    // console.log('startHour', startHour)
    return (
      <Td className='hours'>
        <div style={{ padding: '0 5px' }}>
          <span>{startHour}-{endHour}</span>
          <br />
          <span>Meal:{isHourMeal ? '60' : '30'}Mins</span>
          <br />
          <span>({mealHour}-{mealHour})</span>
        </div>
      </Td>
    )
  }


  const handleRow = (employeeWeekInfo, key) => {
    // const { startHour, endHour, mealHour, isHourMeal } = employeeWeekInfo.tuesday
    console.log(employeeWeekInfo)
    return (
      <Tr key={key}>
        <Td className='employeeName'>{employeeWeekInfo.employeeName}</Td>
        {employeeWeekInfo.weekDays.map((dayHours) => {
          const { startHour, endHour, mealHour, isHourMeal } = dayHours
          return Object.keys(dayHours).length > 0
            ? handleHourColumn(startHour, endHour, mealHour, isHourMeal)
            : <Td></Td>
        })}
        <Td className='totalHours'>{employeeWeekInfo.totalHours}</Td>
      </Tr>
    )
  }

  return (
    <Table>
      <Thead>
        <Tr>
          {tableHeaders.map((header, key) => (<Th key={key}>{header}</Th>))}
        </Tr>
      </Thead>
      <Tbody>
        {employeeWeekDates.map((employeeWeekInfo, key) => (handleRow(employeeWeekInfo, key)))}
        {/* <Tr>
          <Td>

          </Td>
        </Tr> */}
      </Tbody>
    </Table>
  )
}

export default ScheduleTable

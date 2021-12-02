import './ScheduleTable.css'
import { Table } from 'react-bootstrap'
import { ScheduleHoursBox } from '../..';
import { IIcon, iconComponents, MButton } from '../../../components'

const tableHeaders = ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Horas Asignadas']

const ScheduleTable = ({ users, isEditable, onOpenScheduleEdit, onOpenScheduleDetails }) => {
  // console.log('users', users)
  /** Displays the user schedule hours for each day of the week within one row.
   * @param user user with schedule information
   */
  const handleRow = (user, key) => {
    const { name, weekDates, totalHours } = user;

    /** Array of weekDate objects where the indexes represent the day in number form. */
    // let weekDatesArr = [0, 1, 2, 3, 4, 5, 6].map(day => weekDates[day] ? weekDates[day] : null)

    return (
      <tr key={name}>
        {isEditable && (
          <td className='align-middle icon'>
            <IIcon
              name='pen'
              width={14}
              height={14}
              color='primary'
              onClick={() => onOpenScheduleEdit(user)}
            />
          </td>
        )}
        <td className='nameTd'>
          <p className='name' onClick={() => onOpenScheduleDetails(user)}>
            {name}
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

  console.log('users', users)
  return (
    <div className='scheduleTable'>
      <Table responsive size="sm" className='scheduleTable__table'>
        <thead>
          <tr>
            {isEditable && <th></th>}
            <th className='name'>{'Nombre'}</th>
            {(window.innerWidth > 1080)
              ? tableHeaders.map(header => (<th key={header}>{header}</th>))
              : <th>{tableHeaders[tableHeaders.length - 1]}</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => handleRow(user, i))}
          {/* <tr>
            <td>
              <MButton
                IconComponent={iconComponents.CheckMark}
                iconSize='sm'
                text='Aprobar'
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

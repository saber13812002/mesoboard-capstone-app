import './ScheduleTable.css'
import { Table } from 'react-bootstrap'
import { ScheduleHoursBox } from '../..';
import { IIcon, iconComponents, MButton } from '../../../components'

const tableHeaders = ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Horas Asignadas']

const ScheduleTable = ({ users, isEditable, onOpenScheduleEdit, onOpenScheduleDetails, onMailSchedule, amountMailsSend, ref }) => {
  /** Displays the user schedule hours for each day of the week within one row.
   * @param user user with schedule information
   */
  const handleRow = (user, key) => {
    const { name, weekDates, totalHours, isHourLunch } = user;
    // console.log('isHourLunch', isHourLunch)

    /** Array of weekDate objects where the indexes represent the day in number form. */
    // let weekDatesArr = [0, 1, 2, 3, 4, 5, 6].map(day => weekDates[day] ? weekDates[day] : null)

    return (
      <tr key={name + key}>
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
            <td key={key + i + name} className='hoursBox'>
              <ScheduleHoursBox weekDate={weekDate} isHourLunch={isHourLunch} />
            </td>
          )
          : <td key={name + i}></td>
        )}
        {(weekDates.length === 0) && [0, 1, 2, 3, 4, 5, 6].map(i => <td key={i}></td>)}
        <td className='totalHours'>{totalHours}</td>
      </tr>
    )
  }

  // console.log('users', users)
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
            <td></td>
            <td>
              <MButton
                IconComponent={iconComponents.SendMail}
                iconSize='sm'
                text='Enviar'
                variant='primary'
                size='sm'
                style={{ margin: '0 0 0 -22px' }}
                ref={ref}
                disabled={amountMailsSend > 1}
                onClick={onMailSchedule}
              />
            </td>
          </tr> */}
        </tbody>
      </Table>
      {/* <div className='ml-2 pt-2' style={{ marginTop: '-48px' }}>
        <MButton
          IconComponent={iconComponents.SendMail}
          iconSize='sm'
          text='Enviar'
          variant='primary'
          size='sm'
        />
      </div> */}
    </div>
  )
}

export default ScheduleTable

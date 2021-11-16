import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { Icon, iconComponents, MButton } from '../..'
import { getDayName, beautifyDate } from '../../../services/scheduleService'
import { ScheduleHoursBox } from '../../../contentView'

const ScheduleEdit = ({ employee, dateStart, dateEnd, onWeekDateAdd, onWeekDateHoursUpdate, onCloseScheduleEdit }) => {
  const { employeeName, weekDates } = employee;
  console.log('dateStart', beautifyDate(dateStart))
  console.log('dateEnd', beautifyDate(dateEnd))

  const handleTurnChange = (day, e) => {
    const turnIndex = e.target.value - 1;
    onWeekDateHoursUpdate(day, turnIndex)
    e.preventDefault()
  }

  const portalElement = document.getElementById('navdrawer-portal')

  return (
    <Modal
      onClose={onCloseScheduleEdit}
      portalElement={portalElement}
      classes={classes}
    >
      <div className='scheduleEdit'>
        <h3 className=''>{employeeName}</h3>
        <small>{beautifyDate(dateStart)} - {beautifyDate(dateEnd)}</small>
        <div className='d-flex flex-wrap mt-4'>
          {weekDates.map((weekDate, day) => {
            if (!weekDate) {
              return (
                <MButton
                  key={day}
                  IconComponent={iconComponents.Plus}
                  iconColor='dark'
                  text={getDayName(day)}
                  variant='outline-primary'
                  className='mr-2'
                  size='sm'
                  onClick={() => onWeekDateAdd(day)}
                />
              )
            }
            return null
          })}
        </div>
        {weekDates.map((weekDate, day) => {
          if (weekDate) {
            return (
              // THE USE OF 'display: grid' would be best
              <div key={day} className='scheduleEdit__data d-flex justify-content-between align-items-center w-100 mt-3'>
                <h4>{getDayName(day)}</h4>
                <input type='number' onChange={(e) => handleTurnChange(day, e)} />
                <ScheduleHoursBox weekDate={weekDate} showMealMins={false} className='scheduleEdit__hoursBox' />
                <Icon
                  IconComponent={iconComponents.trash}
                  size='md'
                  color='red'
                />
              </div>
            )
          }
          return null
        })}
        <MButton
          className='w-100 mt-4'
          text='Save Changes'
          variant='primary'
        />
      </div>
    </Modal>
  )
}

export default ScheduleEdit
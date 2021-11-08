import './ScheduleEdit.css'
import classes from './ScheduleEditModal.module.css'
import { Modal } from '../..'
import { MButton, Icon, ICON_OPTIONS } from '../..'
import { WEEK_DAY_ENUM } from '../../../constants/scheduleConstant'
import { ScheduleHoursBox } from '../../../content'

const ScheduleEdit = ({ employee, onWeekdayAdd, onWeekdayHoursUpdate, onCloseScheduleEdit }) => {
  const { employeeName, weekdays } = employee;

  const handleTurnChange = (weekdayIndex, e) => {
    const turnIndex = e.target.value - 1;
    onWeekdayHoursUpdate(weekdayIndex, turnIndex)
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
        <h3>{employeeName}</h3>
        <div className='d-flex flex-wrap'>
          {weekdays.map((weekday, i) => {
            if (!weekday) {
              return (
                <MButton
                  key={i}
                  icon={ICON_OPTIONS.plus}
                  text={WEEK_DAY_ENUM[i]}
                  variant='outline-primary'
                  className='mr-2'
                  size='sm'
                  onClick={() => onWeekdayAdd(i)}
                />
              )
            }
            return null
          })}
          {weekdays.map((weekday, i) => {
            if (weekday) {
              return (
                // I THINK THE USE OF 'display: grid' would be best
                <div key={i} className='scheduleEdit__data d-flex justify-content-between align-items-center w-100 mt-3'>
                  <h4>{WEEK_DAY_ENUM[i]}</h4>
                  <input type='number' onChange={(e) => handleTurnChange(i, e)} />
                  <ScheduleHoursBox weekday={weekday} showMealMins={false} className='scheduleEdit__hoursBox' />
                  <Icon icon={ICON_OPTIONS.trash} variant='danger' className='mb-3' />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </Modal>
  )
}

export default ScheduleEdit
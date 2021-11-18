import './DateRange.css'
import { Icon, iconComponents } from "../../../components"
import { toISOString, beautifyDate } from '../../../services/scheduleService'

// const getDate = d => d.toISOString().slice(0, 10)


const DateRange = ({ dateStart, dateEnd, disablePrev, disableNext, onGoToNextWeek, onGoToPrevious }) => {
  return (
    <div className='dateRange d-flex align-items-start'>
      {disablePrev ? (
        <Icon
          IconComponent={iconComponents.CaretLeftOutline}
          size='x-lg'
          className='mr-2'
        />
      ) : (
        <Icon
          IconComponent={iconComponents.CaretLeft}
          size='x-lg'
          className='mr-2'
          onClick={onGoToPrevious}
        />
      )}
      <time className='d-flex align-items-start'>
        <p>{beautifyDate(dateStart)}</p>
        <p className='mr-1 ml-1'> - </p>
        <p> {beautifyDate(dateEnd)}</p>
      </time>
      {disableNext ? (
        <Icon
          IconComponent={iconComponents.CaretRightOutline}
          size='x-lg'
          className='ml-2'
        />
      ) : (
        <Icon
          IconComponent={iconComponents.CaretRight}
          size='x-lg'
          className='ml-2'
          onClick={() => onGoToNextWeek()}
        />
      )}
    </div>
  )
}

export default DateRange

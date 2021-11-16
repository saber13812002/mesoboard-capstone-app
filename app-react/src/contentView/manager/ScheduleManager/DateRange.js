import './DateRange.css'
import { Icon, iconComponents } from "../../../components"
import { toISOString, beautifyDate } from '../../../services/scheduleService'

// const getDate = d => d.toISOString().slice(0, 10)


const DateRange = ({ dateStart, dateEnd, disableNext, onGoToNextWeek, onGoToPrevious }) => {
  // cons
  // console.log('DateRange', dateStart)
  // console.log('dateObjToString', dateObjToString(dateStart))
  // console.log('weekStart', weekStart, typeof weekStart)

  // weekStart = beautifyDate(weekStart)
  // weekEnd = beautifyDate(weekEnd)

  // console.log('dateStart', dateStart.format())
  // console.log('dateEnd', dateEnd.format())


  // console.log('toISOString', dateEnd.toISOString().slice(0, 10))
  // console.log('toISOString', toISOString(dateEnd))
  // console.log('beautifyDate', beautifyDate(dateEnd))



  // console.log(dateStart.format('YYYY-MM-DD'))

  // new Date().toISOString().slice(0, 10);
  // console.log('------\n')
  // console.log('weekEnd.toDate()', weekEnd.toDate(), typeof weekEnd.toDate())

  return (
    <div className='dateRange d-flex align-items-start'>
      <Icon
        IconComponent={iconComponents.CaretLeft}
        size='x-lg'
        className='mr-2'
        onClick={onGoToPrevious}
      />
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
          onClick={() => onGoToNextWeek()}
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

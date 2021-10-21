import { useState } from 'react'
import ScheduleTable from './ScheduleTable'
import { MButton } from '../../../components/index'
import {
  Icon,
  ICON_OPTIONS
} from '../../../components/index'

/**
  weekDateRange: {
    startWeekDate: __,
    endWeekDate: __,
  }
  employeeWeekDates: [
    {
      employee: { ...userInfo }, //access through AuthContext
      tuesday: {
        startHour: __,
        endHour: __,
        mealHour: __
      },
      wednesday:  { _asAbove_ },
      thursday:   { _asAbove_ },
      friday:     { _asAbove_ },
      saturday:   { _asAbove_ },
      sunday:     { _asAbove_ },
      monday:     { _asAbove_ },
      totalHours: __
    }
  ]
 */

const ScheduleManager = () => {
  // states should be handled with either context, zustang, or redux. you decide.
  const [weekDateRange, setWeekDateRange] = useState({})
  const [employeeWeekDates, setEmployeeWeekDates] = useState([])

  // useEffect fetching the data to initialize the states

  // functions to handle schedule editing (handle state management)

  return (
    <div>
      {/* <p>ScheduleManager Component</p> */}
      {/* section for the weekDateRange component and the buttons */}
      <div className='d-flex justify-content-between mb-3'>
        <div>
          Date Range
        </div>
        <div className='d-flex'>
          <MButton
            icon={ICON_OPTIONS.download}
            text='Template CSV'
            variant='outline-primary'
            className='mr-2'
            size='sm'
          />
          <MButton
            icon={ICON_OPTIONS.upload}
            text='Import CSV'
            variant='secondary'
            className='mr-2'
            size='sm'
          />
          <Icon
            icon={ICON_OPTIONS.download}
            variant={'primary'}
            className={'ml-2'}
          />
        </div>
      </div>


      {/* section for the scheduleTable and approve button */}
      <ScheduleTable />

      <MButton
        icon={ICON_OPTIONS.check}
        text='Approve'
        variant='primary'
        className='mt-3'
        size='sm'
      />

      {/* section for the ScheduleEditModal portal component */}
    </div>
  )
}

export default ScheduleManager

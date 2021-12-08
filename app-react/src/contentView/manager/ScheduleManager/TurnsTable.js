import { useState, Fragment } from 'react'
import './TurnsTable.css'
import { Table } from 'react-bootstrap'
import { MButton, Icon, iconComponents, IIcon } from '../../../components'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';


const TurnsTable = ({ turns, onAddNewTurn, addingNewTurn, onSaveTurn, onCancel, onDeleteTurn, isLimit }) => {
  const [selectTimeStart, setSelectTimeStart] = useState(14400) //represents 4:00 AM
  const [selectTimeEnd, setSelectTimeEnd] = useState(43200)  //represents 12:00 PM
  const [selectTimeLunch, setSelectTimeLunch] = useState(36000) //represents 10:AM
  const [isStartDuplicate, setIsStartDuplicate] = useState(false)
  const [isEndDuplicate, setIsEndDuplicate] = useState(false)
  const [isLunchDuplicate, setIsLunchDuplicate] = useState(false)
  const handleSelectTimeStart = (e) => {
    //const time = e / (3600)
    const bol = turns.some(l => l.timeStart == timeFromInt(e, { format: 12, leadingZero: false }))
    setIsStartDuplicate(bol)
    setSelectTimeStart(e)
    setSelectTimeLunch(e + (30 * 60))
    // console.log(e, time)
  }
  const handleSelectTimeEnd = (e) => {
    // const time = e / (3600)
    const bol = turns.some(l => l.timeEnd == timeFromInt(e, { format: 12, leadingZero: false }))
    setIsEndDuplicate(bol)
    setSelectTimeEnd(e)
    // console.log(e, time)
  }
  const handleSelectTimeLunch = (e) => {
    // const time = e / (3600)
    const bol = turns.some(l => l.timeLunch == timeFromInt(e, { format: 12, leadingZero: false }))
    setIsLunchDuplicate(bol)
    setSelectTimeLunch(e)
    // console.log(e, time)
  }

  // console.log('<turns>', turns)
  return (
    <div className='scheduleTurns'>
      <h5>TURNOS</h5>
      <Table responsive size="sm" className='scheduleTurns__table'>
        <thead>
          <tr style={{ fontSize: '14px' }}>
            {(turns.length === 0) ? <td></td> :
              <>
                <td>ID</td>
                <td>Entrada</td>
                <td>Salida</td>
                <td>Almuerzo</td>
              </>}
          </tr>
        </thead>
        <tbody className={`${turns.length === 0 ? 'disableBorder' : ''}`}>
          {turns.map((turn, i) => {
            // console.log('-------', turn)
            const { turnIndex, timeStart, timeEnd, timeLunch } = turn;
            const isValidIndex = turnIndex >= 0
            // console.log('turnIndex', turnIndex)
            return (
              <Fragment key={turnIndex + timeStart + timeEnd + timeLunch}>
                {isValidIndex && <tr style={{ fontWeight: '500' }}>
                  <td><strong>{turnIndex}</strong></td>
                  <td>{timeStart}</td>
                  <td>{timeEnd}</td>
                  <td>{timeLunch}</td>
                  <td>
                    {!addingNewTurn && <Icon
                      IconComponent={iconComponents.Trash}
                      onClick={() => onDeleteTurn(turn.turnIndex)}
                      color='red'
                    />}
                  </td>
                  {/* <td></td> */}
                </tr>}
                {addingNewTurn && !isValidIndex && (
                  //<TimePicker start="10:00" end="21:00" step={30} />
                  <tr style={{ fontWeight: '500' }}>
                    {isValidIndex ? <td><strong>{turnIndex}</strong></td> : <td></td>}
                    <td><TimePicker start="04:00" end="18:00" format="12" step={30} onChange={handleSelectTimeStart} value={selectTimeStart} /></td>
                    <td><TimePicker start={timeFromInt(selectTimeStart + (2 * 3600))} end="23:30" format="12" step={30} onChange={handleSelectTimeEnd} value={selectTimeEnd} /></td>
                    <td><TimePicker start={timeFromInt(selectTimeStart + (30 * 60))} end={timeFromInt(selectTimeEnd - (30 * 60))} format="12" step={30} onChange={handleSelectTimeLunch} value={selectTimeLunch} /></td>
                    {!isStartDuplicate && !isEndDuplicate && !isLunchDuplicate && <td className='text-center align-middle' onClick={() => onSaveTurn(selectTimeStart, selectTimeEnd, selectTimeLunch)}>
                      {!isStartDuplicate && !isEndDuplicate && !isLunchDuplicate && <IIcon
                        name='checkmark'
                        width={14}
                        height={14}
                        color='primary'
                      />}
                    </td>}
                  </tr>
                )}
              </Fragment>
            )
          })}
          {/* 
          {addingNewTurn && !turnIndex && (
            //<TimePicker start="10:00" end="21:00" step={30} />
            <tr style={{ fontWeight: '500' }}>
            <td><strong>{turnIndex}</strong></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
          </tr>
          )} */}
          {turns.length === 0 && (
            <tr style={{ fontWeight: '500' }}>
              <td className='pt-2'>Create hours to manage user schedules</td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* {turns.length === 0 && (
        <div className='ml-2 pt-2 pb-2' style={{ marginTop: '-48px', fontWeight: '500' }}>
          <p>Create turn hours to manage user schedules</p>
        </div>
      )} */}
      {!isLimit && !addingNewTurn && <div className='ml-2 pt-2' style={{ marginTop: '-48px' }}>
        <MButton
          onClick={onAddNewTurn}
          IconComponent={iconComponents.Plus}
          text='Nuevo Turno'
          variant='primary'
          size='sm'
        // style={{ marginTop: '5px', marginLeft: '8px' }}
        />
      </div>}
      {!isLimit && addingNewTurn && <div className='ml-2 pt-2' style={{ marginTop: '-48px' }}>
        <MButton
          onClick={onCancel}
          text='Cancel'
          variant='light'
          size='sm'
        />
      </div>}
    </div>
  )
}

export default TurnsTable
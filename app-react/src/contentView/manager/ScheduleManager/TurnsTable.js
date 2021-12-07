import { useState, Fragment } from 'react'
import './TurnsTable.css'
import { Table } from 'react-bootstrap'
import { MButton, Icon, iconComponents, IIcon } from '../../../components'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';


const TurnsTable = ({ turns, onAddNewTurn, addingNewTurn, onSaveTurn, onCancel, onDeleteTurn }) => {
  const [selectTimeStart, setSelectTimeStart] = useState(14400) //represents 4:00 AM
  // const [selectTimeEnd, setSelectTimeEnd] = useState(14400)
  // const [selectTimeLunch, setSelectTimeLunch] = useState(14400)
  const [selectTimeEnd, setSelectTimeEnd] = useState(43200)  //represents 12:00 PM
  const [selectTimeLunch, setSelectTimeLunch] = useState(36000) //represents 10:AM

  const handleSelectTimeStart = (e) => {
    const time = e / (3600)
    setSelectTimeStart(e)
    // console.log(e, time)
  }
  const handleSelectTimeEnd = (e) => {
    // const time = e / (3600)
    setSelectTimeEnd(e)
    // console.log(e, time)
  }
  const handleSelectTimeLunch = (e) => {
    // const time = e / (3600)
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
                    <Icon
                      IconComponent={iconComponents.Trash}
                      onClick={() => onDeleteTurn(turn.turnIndex)}
                      color='red'
                    />
                  </td>
                  {/* <td></td> */}
                </tr>}
                {addingNewTurn && !isValidIndex && (
                  //<TimePicker start="10:00" end="21:00" step={30} />
                  <tr style={{ fontWeight: '500' }}>
                    {isValidIndex ? <td><strong>{turnIndex}</strong></td> : <td></td>}
                    <td><TimePicker start="04:00" end="18:00" format="12" step={30} onChange={handleSelectTimeStart} value={selectTimeStart} /></td>
                    <td><TimePicker start={timeFromInt(selectTimeStart)} end="24:00" step={30} onChange={handleSelectTimeEnd} value={selectTimeEnd} /></td>
                    <td><TimePicker start={timeFromInt(selectTimeStart + (30 * 60))} end={timeFromInt(selectTimeEnd)} step={30} onChange={handleSelectTimeLunch} value={selectTimeLunch} /></td>
                    <td className='text-center align-middle' onClick={() => onSaveTurn(selectTimeStart, selectTimeEnd, selectTimeLunch)}>
                      <IIcon
                        name='checkmark'
                        width={14}
                        height={14}
                        color='primary'
                      // onClick={() => onSaveTurn(selectTimeStart, selectTimeEnd, selectTimeLunch)}
                      />
                    </td>
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
      {!addingNewTurn && <div className='ml-2 pt-1' style={{ marginTop: '-48px' }}>
        <MButton
          onClick={onAddNewTurn}
          IconComponent={iconComponents.Plus}
          text='Nuevo Turno'
          variant='primary'
          size='sm'
        // style={{ marginTop: '5px', marginLeft: '8px' }}
        />
      </div>}
      {addingNewTurn && <div className='ml-2 pt-1' style={{ marginTop: '-48px' }}>
        <MButton
          onClick={onCancel}
          text='Cancel'
          variant='light'
          size='sm'
        // style={{ marginTop: '-48px' }}
        // style={{ marginTop: '5px', marginLeft: '8px' }}
        />
      </div>}
    </div>
  )
}

export default TurnsTable
import { useState, Fragment } from 'react'
import './TurnsTable.css'
import { Table } from 'react-bootstrap'
import { MButton, Icon, iconComponents, IIcon } from '../../../components'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';


const TurnsTable = ({ turns, onAddNewTurn, addingNewTurn, onSaveTurn, onCancel }) => {
  const [selectHourStart, setSelectHourStart] = useState(14400) //represents 4:00 AM
  // const [selectHourEnd, setSelectHourEnd] = useState(14400)
  // const [selectHourLunch, setSelectHourLunch] = useState(14400)
  const [selectHourEnd, setSelectHourEnd] = useState(43200)  //represents 12:00 PM
  const [selectHourLunch, setSelectHourLunch] = useState(36000) //represents 10:AM

  const handleSelectHourStart = (e) => {
    const hour = e / (3600)
    setSelectHourStart(e)
    // console.log(e, hour)
  }
  const handleSelectHourEnd = (e) => {
    // const hour = e / (3600)
    setSelectHourEnd(e)
    // console.log(e, hour)
  }
  const handleSelectHourLunch = (e) => {
    // const hour = e / (3600)
    setSelectHourLunch(e)
    // console.log(e, hour)
  }

  // console.log('<turns>', turns)
  return (
    <div className='scheduleTurns'>
      <h5>TURNOS</h5>
      <Table responsive size="sm" className='scheduleTurns__table'>
        <thead>
          <tr style={{ fontSize: '14px' }}>
            <td>ID</td>
            <td>Entrada</td>
            <td>Salidas</td>
            <td>Almuerzo</td>
          </tr>
        </thead>
        <tbody>
          {turns.map((turn) => {
            const { turnId, hourStart, hourEnd, hourLunch } = turn
            // console.log('turnId, hourStart, hourEnd, hourLunch\n\n')
            // console.log(turnId, hourStart, hourEnd, hourLunch)
            // console.log(typeof turnId, typeof hourStart, turnId)
            const isValidId = turnId >= 0
            return (
              <Fragment key={turnId}>
                {isValidId && <tr style={{ fontWeight: '500' }}>
                  <td><strong>{turnId}</strong></td>
                  <td>{hourStart}</td>
                  <td>{hourEnd}</td>
                  <td>{hourLunch}</td>
                  {/* <td></td> */}
                </tr>}
                {addingNewTurn && !isValidId && (
                  //<TimePicker start="10:00" end="21:00" step={30} />
                  <tr style={{ fontWeight: '500' }}>
                    {isValidId ? <td><strong>{turnId}</strong></td> : <td></td>}
                    <td><TimePicker start="04:00" end="18:00" format="12" step={30} onChange={handleSelectHourStart} value={selectHourStart} /></td>
                    <td><TimePicker start={timeFromInt(selectHourStart)} end="24:00" step={30} onChange={handleSelectHourEnd} value={selectHourEnd} /></td>
                    <td><TimePicker start="03:00" end="22:00" step={30} onChange={handleSelectHourLunch} value={selectHourLunch} /></td>
                    <td className='text-center align-middle' onClick={() => onSaveTurn(selectHourStart, selectHourEnd, selectHourLunch)}>
                      <IIcon
                        name='checkmark'
                        width={14}
                        height={14}
                        color='primary'
                      // onClick={() => onSaveTurn(selectHourStart, selectHourEnd, selectHourLunch)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
          {/* 
          {addingNewTurn && !turnId && (
            //<TimePicker start="10:00" end="21:00" step={30} />
            <tr style={{ fontWeight: '500' }}>
            <td><strong>{turnId}</strong></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
          </tr>
          )} */}
        </tbody>
      </Table>
      {!addingNewTurn && <div className='ml-2 pt-2' style={{ marginTop: '-48px' }}>
        <MButton
          onClick={onAddNewTurn}
          IconComponent={iconComponents.Plus}
          text='Nuevo Turno'
          variant='primary'
          size='sm'
        // style={{ marginTop: '5px', marginLeft: '8px' }}
        />
      </div>}
      {addingNewTurn && <div className='ml-2 pt-2' style={{ marginTop: '-48px' }}>
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
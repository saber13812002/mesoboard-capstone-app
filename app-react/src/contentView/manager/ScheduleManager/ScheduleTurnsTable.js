import './ScheduleTurnsTable.css'
import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { MButton, Icon, iconComponents } from '../../../components'
import TimePicker from 'react-bootstrap-time-picker';
import { timeFromInt } from 'time-number';


const ScheduleTurnsTable = ({ turns, onAddNewTurn, addingNewTurn, onSaveTurn }) => {
  const [selectHourStart, setSelectHourStart] = useState(3600)
  const [selectHourEnd, setSelectHourEnd] = useState('3600')
  const [selectHourLunch, setSelectHourLunch] = useState('3600')

  const handleSelectHourStart = (e) => {
    const hour = e / (3600)
    setSelectHourStart(e)
    console.log(e, hour, selectHourStart)
  }
  const handleSelectHourEnd = (e) => {
    const hour = e / (3600)
    setSelectHourEnd(e)
    console.log(e, hour, selectHourEnd)
  }
  const handleSelectHourLunch = (e) => {
    const hour = e / (3600)
    setSelectHourLunch(e)
    console.log(e, hour, selectHourLunch)
  }

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
            const { id, start, end, lunch } = turn
            return (
              <>
                {id && <tr style={{ fontWeight: '500' }}>
                  <td><strong>{id}</strong></td>
                  <td>{start}</td>
                  <td>{end}</td>
                  <td>{lunch}</td>
                  <td><Icon icon={iconComponents.Pen} /></td>
                </tr>}
                {addingNewTurn && !id && (
                  //<TimePicker start="10:00" end="21:00" step={30} />
                  <tr style={{ fontWeight: '500' }}>
                    <td><strong>{id}</strong></td>
                    <td><TimePicker start="03:00" end="21:00" format="12" step={30} onChange={handleSelectHourStart} value={selectHourStart} /></td>
                    <td><TimePicker start={timeFromInt(selectHourStart)} end="21:00" step={30} onChange={handleSelectHourEnd} value={selectHourEnd} /></td>
                    <td><TimePicker start="03:00" end="21:00" step={30} onChange={handleSelectHourLunch} value={selectHourLunch} /></td>
                    {addingNewTurn && <td><Icon icon={iconComponents.Check} className='mr-2' onClick={() => onSaveTurn(selectHourStart, selectHourEnd, selectHourLunch)} /></td>}
                  </tr>

                )}
              </>
            )
          }
          )}
          {/* 
          {addingNewTurn && !id && (
            //<TimePicker start="10:00" end="21:00" step={30} />
            <tr style={{ fontWeight: '500' }}>
            <td><strong>{id}</strong></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
            <td><TimePicker start="10:00" end="21:00" step={30} /></td>
          </tr>
          )} */}
        </tbody>

      </Table>
      <MButton
        onClick={onAddNewTurn}
        text='Nuevo Turno'
        variant='primary'
        size='sm'
        className='ml-1 pt-2'
        style={{ marginTop: '-48px' }}
      />
      {!addingNewTurn && <MButton
        onClick={onAddNewTurn}
        IconComponent={iconComponents.Plus}
        text='Nuevo Turno'
        variant='primary'
        size='sm'
        className='ml-1 pt-2'
        style={{ marginTop: '-48px' }}
      // style={{ marginTop: '5px', marginLeft: '8px' }}
      />}
      {addingNewTurn && <MButton
        onClick={onAddNewTurn}
        IconComponent={iconComponents.Plus}
        text='Cancel'
        variant='secondary'
        size='sm'
        className='ml-1 pt-2'
      // style={{ marginTop: '5px', marginLeft: '8px' }}
      />}

    </div>
  )
}

export default ScheduleTurnsTable
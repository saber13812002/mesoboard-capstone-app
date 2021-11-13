import './ScheduleTurnsTable.css'
import { Table } from 'react-bootstrap'
import { MButton, iconComponents } from '../../../components'

const ScheduleTurnsTable = ({ turns, onAddNewTurn, addingNewTurn, onSaveTurn }) => {
  const [selectStartHour, setSelectStartHour] = useState(3600)
  const [selectEndHour, setSelectEndHour] = useState('3600')
  const [selectLunchHour, setSelectLunchHour] = useState('3600')

  const handleSelectHourStart = (e) => {
    const hour = e / (3600)
    setSelectStartHour(e)
    console.log(e, hour, selectStartHour)
  }
  const handleSelectHourEnd = (e) => {
    const hour = e / (3600)
    setSelectEndHour(e)
    console.log(e, hour, selectEndHour)
  }
  const handleSelectHourLunch = (e) => {
    const hour = e / (3600)
    setSelectLunchHour(e)
    console.log(e, hour, selectLunchHour)
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
                  <td><Icon icon={ICON_OPTIONS.pencil} /></td>
                </tr>}
                {addingNewTurn && !id && (
                  //<TimePicker start="10:00" end="21:00" step={30} />
                  <tr style={{ fontWeight: '500' }}>
                    <td><strong>{id}</strong></td>
                    <td><TimePicker start="03:00" end="21:00" format="12" step={30} onChange={handleSelectHourStart} value={selectHourStart} /></td>
                    <td><TimePicker start={timeFromInt(selectHourStart)} end="21:00" step={30} onChange={handleSelectHourEnd} value={selectHourEnd} /></td>
                    <td><TimePicker start="03:00" end="21:00" step={30} onChange={handleSelectHourLunch} value={selectHourLunch} /></td>
                    {addingNewTurn && <td><Icon icon={ICON_OPTIONS.check} className='mr-2' onClick={() => onSaveTurn(selectHourStart, selectHourEnd, selectHourLunch)} /></td>}
                  </tr>

                )}
                {/* {addingNewTurn && !id && <div><Icon icon={ICON_OPTIONS.check} className='mr-2' onClick={onSaveTurn}/></div> }        */}

              </>

            )
          }
          )}
          {/* {addingNewTurn && !id && (
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
      {!addingNewTurn && <MButton
        onClick={onAddNewTurn}
        icon={iconComponents.Plus}
        text='Nuevo Turno'
        variant='primary'
        size='sm'
        className='ml-1 pt-2'
        style={{ marginTop: '5px', marginLeft: '8px' }}
      />}
      {addingNewTurn && <MButton
        onClick={onAddNewTurn}
        icon={iconComponents.Plus}
        text='Cancel'
        variant='secondary'
        size='sm'
        className='ml-1 pt-2'
        style={{ marginTop: '5px', marginLeft: '8px' }}
      />}

    </div>
  )
}

export default ScheduleTurnsTable

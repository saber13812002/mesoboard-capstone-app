import './ScheduleTurnsTable.css'
import { Table } from 'react-bootstrap'
import { MButton, ICON_OPTIONS } from '../../../components'

const ScheduleTurnsTable = ({ turns, onAddNewTurn }) => {
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
          {turns.map(({ id, start, end, lunch }) =>
            <tr style={{ fontWeight: '500' }}>
              <td><strong>{id}</strong></td>
              <td>{start}</td>
              <td>{end}</td>
              <td>{lunch}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <MButton
        onClick={onAddNewTurn}
        icon={ICON_OPTIONS.plus}
        text='Nuevo Turno'
        variant='primary'
        size='sm'
        className='ml-1 pt-2'
        style={{ marginTop: '-48px' }}
      />
    </div>
  )
}

export default ScheduleTurnsTable

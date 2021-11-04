import { Icon } from '../..'
import { Button } from 'react-bootstrap'
import './MButton.css'

const MButton = ({ icon, text, variant = 'primary', className, size, style, onClick }) => {
  let iconSize = 'medium';
  if (icon) {
    iconSize = 'small'
  }


  // implement and handle the portal -> ScheduleEditModal component
  return (
    <div className={className} style={style}>
      <Button variant={`${variant}`} size={size} onClick={onClick} >
        <div className='d-inline'>
          <Icon icon={icon} size={iconSize} isButtonIcon={true} />
        </div>
        {text}
      </Button>
    </div>
  )
}

export default MButton

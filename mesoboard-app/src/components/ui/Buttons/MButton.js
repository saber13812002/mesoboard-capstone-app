import { Icon } from '../../index'
import { Button } from 'react-bootstrap'
import './MButton.css'

const MButton = ({ icon, text, variant = 'primary', className, size }) => {
  let iconSize = 'medium';
  if (icon) {
    iconSize = 'small'
  }


  // implement and handle the portal -> ScheduleEditModal component
  return (
    <div className={className}>
      <Button variant={`${variant}`} size={size} >
        <div className='d-inline'>
          <Icon icon={icon} size={iconSize} isButtonIcon={true} />
        </div>
        {text}
      </Button>
    </div>
  )
}

export default MButton

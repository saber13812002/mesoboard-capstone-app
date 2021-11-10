import { Icon } from '../..'
import { Button } from 'react-bootstrap'
import './MButton.css'

const MButton = ({ type, text, variant = 'primary', icon, size, className, style, onClick }) => {
  let iconSize = 'medium';
  if (icon) {
    iconSize = 'small'
  }

  // if (size === 'sm')


  // implement and handle the portal -> ScheduleEditModal component
  return (
    <div className={className} style={style}>
      <Button variant={`${variant}`} size={size} onClick={onClick} type={type} >
        {icon && (
          <div className='d-inline'>
            <Icon icon={icon} size={iconSize} isButtonIcon={true} />
          </div>
        )}
        {text}
      </Button>
    </div>
  )
}

export default MButton

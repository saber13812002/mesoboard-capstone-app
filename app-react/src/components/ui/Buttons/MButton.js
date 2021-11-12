import { useState } from 'react'
import { Icon } from '../..'
import { Button } from 'react-bootstrap'
import './MButton.css'

/** React Bootstrap Button with icon configuration.
 * - type:      'submit', 'button', 'reset'
 * - text:      text displayed on this button. If button contains icon, then the text is displayed on the right side. Otherwise, it is centralized.
 * - variant:   All React Bootstrap Button variants.
 * - size:      Both React Bootstrap Button sizes: 'sm', 'lg'
 * - IconComponent: Icon component to display on the left side of this button.
 * - iconColor: Atleast 'primary', 'secondary', 'white', 'grey', 'dark', 'red'. Keeps updating with our Icon component.
 * - className
 * - style
 * - onClick
 */
const MButton = ({ type, text = '', variant = 'primary', size = 'md', IconComponent, iconColor = 'white', className, style, onClick }) => {
  const originalIconColor = iconColor;
  const [iconColorState, setIconColorState] = useState(iconColor)

  let onMouseEnterColor = 'white'
  if (variant === 'secondary') {
    onMouseEnterColor = 'dark'
  }


  return (
    <div
      className={className}
      style={style}
      onMouseEnter={() => setIconColorState(onMouseEnterColor)}
      onMouseLeave={() => setIconColorState(originalIconColor)}
    >
      <Button variant={variant} size={size} onClick={onClick} type={type}>
        {
          IconComponent
            ? <div className='d-flex align-items-center'>
              <Icon
                IconComponent={IconComponent}
                size='sm'
                color={iconColorState}
                isButtonIcon={true}
                className='mr-1'
              />
              <span>{text}</span>
            </div>
            : <>{text}</>
        }
      </Button>
    </div>
  )
}

export default MButton

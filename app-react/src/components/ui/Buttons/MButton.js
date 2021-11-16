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
  let onMouseEnterIconColor = 'white'
  let onMouseEnterTextColor = ''
  let textColor = ''


  if (variant.includes('outline')) {
    if (variant.includes('primary')) {
      textColor = '#287F4E'
      iconColor = 'primary'
      onMouseEnterTextColor = 'white'
    }
  }
  if (variant === 'secondary') {
    onMouseEnterIconColor = 'dark'
  }

  const originalIconColor = iconColor;
  const originalTextColor = textColor;
  const [iconColorState, setIconColorState] = useState(iconColor)
  const [textColorState, setTextColorState] = useState(textColor)


  const handleMouseEnter = (onMouseEnterIconColor, onMouseEnterTextColor) => {
    setIconColorState(onMouseEnterIconColor)
    setTextColorState(onMouseEnterTextColor)
  }

  const handleMouseLeave = () => {
    setIconColorState(originalIconColor)
    setTextColorState(originalTextColor)
  }

  return (
    <Button
      style={{ zIndex: '100' }}
      variant={variant}
      size={size}
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      onMouseEnter={() => handleMouseEnter(onMouseEnterIconColor, onMouseEnterTextColor)}
      // onMouseEnter={() => setIconColorState(onMouseEnterIconColor)}
      // onMouseLeave={() => setIconColorState(originalIconColor)}
      onMouseLeave={() => handleMouseLeave()}
    >
      {
        IconComponent
          ? <div className='d-flex align-items-center text-nowrap'>
            <Icon
              IconComponent={IconComponent}
              size='sm'
              color={iconColorState}
              isButtonIcon={true}
              className='mr-1'
            />
            <span style={{ color: textColorState }}>{text}</span>
          </div>
          : <>{text}</>
      }
    </Button>
  )
}

export default MButton
import './Icon.css'
// import classes from './Icon.module.css'
import { IconContext } from 'react-icons'

// Icon Wrapper
/** 
 * - Icon:  Either of the icon component options in iconComponents.js file
 * - size:  'sm', 'md', 'lg'
 * - color: 'primary', 'secondary', 'white', 'grey', 'dark', 'red'
 * - className
 * - style
 * - isSidebarItemActive: Should only be used by sidebar items. Determines if this icon should be colored with the primary color.
 */
const Icon = ({ IconComponent, size = 'md', color = 'dark', className, style, isSidebarItemActive }) => {
  switch (size) {
    case 'sm':
      size = '14px'; break;
    case 'lg':
      size = '24px'; break;
    default:
      size = '20px'; //'md'
  }


  switch (color) {
    case 'primary':
      color = '#287F4E'; break;
    case 'secondary':
      color = 'rgba(245, 212, 10, 0.5)'; break;
    case 'white':
      color = '#fff'; break;
    case 'grey':
      color = '#767676'; break;
    case 'red':
      color = '#BA302B'; break;
    default:
      color = '#3E3C3C'
  }

  if (isSidebarItemActive)
    color = '#287F4E'

  return (
    <IconContext.Provider value={{ color, size, className }}>
      <IconComponent
        color={color}
        size={size}
        className={`icon ${className}`}
        style={style}
      />
    </IconContext.Provider>
  )
}
export default Icon;

/** IconContext's alue property
    color?: string;
    size?: string;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
 */
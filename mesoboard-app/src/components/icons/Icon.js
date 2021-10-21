import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Icon.css'

// myViewbox.StretchDirection = StretchDirection.Both;
// myViewbox.Stretch = Stretch.Fill;
// myViewbox.MaxWidth = 400;
// myViewbox.MaxHeight = 400;

const Icon = ({ icon, size, variant, isButtonIcon, className }) => {
  // viewBox = "min-x min-y width height"
  let minX = 0;
  let minY = 0;
  let color = '';

  // let width = 248;
  // let height = 312;
  let width = 512;
  let height = 512;
  // 0 0 512 512

  if (isButtonIcon) {
    minX = 190;
    minY = -80
  }
  else {
    width = 420;
    height = 420;
    minX = 130;
    minY = -100;
  }

  if (size === 'small') {
    height = 612
  }

  if (variant && variant.includes('primary')) {
    color = '#287F4E'
  }




  const viewBox = `${minX} ${minY} ${width} ${height}`
  return <FontAwesomeIcon
    icon={icon}
    viewBox={viewBox}
    color={color}
    className={className}
    style={{ cursor: 'pointer' }}
  />
}

export default Icon

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Icon.css'
import {
  faCaretDown,
  faCaretLeft,
  faAngleLeft,
  faBell,
  faBars,
  faHome,
  faClock,
  faUser,
  faMoneyBill,
  faPencilRuler,
  faStickyNote,
  faDownload,
  faUpload,
  faCheck,
  faPlus,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'

export const iconOptions = {
  caretDown: faCaretDown,
  caretLeft: faCaretLeft,
  angleLeft: faAngleLeft,
  caretDown: faCaretDown,
  bell: faBell,
  bars: faBars,
  home: faHome,
  clock: faClock,
  user: faUser,
  money: faMoneyBill,
  pencil: faPencilRuler,
  note: faStickyNote,
  download: faDownload,
  upload: faUpload,
  check: faCheck,
  plus: faPlus,
  trash: faTrashAlt,
}

const Icon = ({ icon, size, color, isButtonIcon, className }) => {
  // viewBox = "min-x min-y width height"
  let minX = 0;
  let minY = 0;
  // let color = '';

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

  if (size === 'sm' || size === 'small') {
    height = 612
  }

  if (color && color.includes('primary')) {
    color = '#287F4E'
  }

  if (color && color.includes('danger')) {
    color = '#BA302B'
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

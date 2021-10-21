// icons
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
// import { faBell } from '@fortawesome/free-solid-svg-icons'
// import { faBars } from '@fortawesome/free-solid-svg-icons'
// import { faHome } from '@fortawesome/free-solid-svg-icons'
// import { faClock } from '@fortawesome/free-solid-svg-icons'
// import { faUser } from '@fortawesome/free-solid-svg-icons'
// import { faMoneyBill } from '@fortawesome/free-solid-svg-icons'
// import { faPencilRuler } from '@fortawesome/free-solid-svg-icons'
// import { faStickyNote } from '@fortawesome/free-solid-svg-icons'


// components
import Icon from './icons/Icon';
import NavDrawer from "./modals/NavDrawerModal/NavDrawer";
import NavDrawerModal from "./modals/NavDrawerModal/NavDrawerModal";
import AuthHeader from "./ui/RegistrationHeader";
import MesonLogo from './logos/MesonLogo';
import MesonLogoContainer from './logos/MesonLogoContainer';
import ContentHeader from './ui/ContentHeader';
import ContentHeaderInfo from './ui/ContentHeaderInfo'
import TotalServicioProduccion from './ui/TotalServicioProduccion'
import MButton from './ui/Buttons/MButton'
import {
  faCaretDown,
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
  faCheck
} from '@fortawesome/free-solid-svg-icons'


// components
export {
  Icon,
  NavDrawer,
  NavDrawerModal,
  AuthHeader,
  MesonLogo,
  MesonLogoContainer,
  ContentHeader,
  ContentHeaderInfo,
  TotalServicioProduccion,
  MButton
}

// icon enum/options
export const ICON_OPTIONS = {
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
  check: faCheck
}

import { SidebarList } from '../../../layout/index'
import {
  NavDrawerModal,
  MesonLogoContainer
} from '../../index'

const NavDrawer = ({ onClose }) => {
  return (
    <NavDrawerModal onClose={onClose}>
      <MesonLogoContainer />
      <hr />
      <SidebarList />
    </NavDrawerModal>
  )
}

export default NavDrawer
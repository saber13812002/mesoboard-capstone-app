import classes from './NavDrawerModal.module.css'
import { SidebarList } from '../../../layout'
import { Modal, MesonLogoContainer } from '../..'

const NavDrawer = ({ onClose }) => {
  const portalElement = document.getElementById('navdrawer-portal')

  return (
    <Modal
      onClose={onClose}
      portalElement={portalElement}
      classes={classes}
    >
      <MesonLogoContainer />
      <hr />
      <SidebarList />
    </Modal>
  )
}

export default NavDrawer
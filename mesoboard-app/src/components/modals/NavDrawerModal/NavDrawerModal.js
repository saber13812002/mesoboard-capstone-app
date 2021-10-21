import classes from './NavDrawerModal.module.css'
import ReactDOM from 'react-dom'

const Backdrop = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose} />
}

const ModalOverlay = ({ children }) => {
  return <div className={classes.modal}>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}

const portalElement = document.getElementById('navdrawer-portal')

const NavDrawerModal = ({ children, onClose }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  )
}

export default NavDrawerModal




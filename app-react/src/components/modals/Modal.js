import ReactDOM from 'react-dom'
import { Backdrop, ModalOverlay } from '..'

const Modal = ({ children, onClose, classes, portalElement }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} classes={classes} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay classes={classes}>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  )
}

export default Modal




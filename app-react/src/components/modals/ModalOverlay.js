const ModalOverlay = ({ children, classes }) => {
  return <div className={classes.modal}>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}

export default ModalOverlay
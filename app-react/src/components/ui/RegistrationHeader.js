import React from 'react'

// the title/header of signin, verify permission, and registration component
const RegistrationHeader = ({ type }) => {
  let header = ''
  if (type === 'registration')
    header = 'Verificar Permiso';
  // else if ()
  return (
    <p>
      {header}
    </p>
  )
}

export default RegistrationHeader

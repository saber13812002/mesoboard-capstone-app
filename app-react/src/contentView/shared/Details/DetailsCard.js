import React from 'react'

const DetailsCard = ({ data }) => {
  console.log('details', data)
  const { name } = data;
  return (
    <div>
      <div className='scheduleDetails__profileInfo mb-3 p-3'>
        <h4>{name}</h4>

        
        <h3>Información del usuario va aqui</h3>
      </div>
    </div>
  )
}

export default DetailsCard

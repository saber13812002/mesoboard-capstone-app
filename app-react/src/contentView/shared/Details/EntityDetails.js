import React from 'react'
import { BackButton } from '../../../components'
import { DetailsCard } from '../..'

const EntityDetails = ({ details, onBack }) => {
  console.log('details', details)
  return (
    <div>
      <BackButton onClick={onBack} />
      <DetailsCard />
    </div>
  )
}

export default EntityDetails

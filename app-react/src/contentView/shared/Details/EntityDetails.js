import React from 'react'
import { BackButton } from '../../../components'
import { DetailsCard } from '../..'

const EntityDetails = ({ details, onBack }) => {
  console.log('details', details)
  return (
    <div>
      <BackButton onClick={onBack} />
      <DetailsCard data={details} />
    </div>
  )
}

export default EntityDetails

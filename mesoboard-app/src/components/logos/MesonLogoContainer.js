import React from 'react'
import './MesonLogoContainer.css'
import { MesonLogo } from '..'

const MesonLogoContainer = () => {
  return (
    <div className='mesonIconContainer__logoGrandparentContainer'>
      <div className='mesonIconContainer__logoParentContainer'>
        <div className='mesonIconContainer__logoContainer'>
          <MesonLogo height={50} />
        </div>
      </div>
    </div>
  )
}

export default MesonLogoContainer

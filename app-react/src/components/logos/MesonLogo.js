import React from 'react'
import MesonPng from '../../assets/El_Meson_Sandwiches_logo.png'

const logoDimensionsRatio = 0.56; //height/width = 189/338 = 0.56

const MesonLogo = ({ height, ...rest }) =>
  <img {...rest} src={MesonPng} width={height / logoDimensionsRatio} height={height} alt='Mesoboard Logo' />


export default MesonLogo

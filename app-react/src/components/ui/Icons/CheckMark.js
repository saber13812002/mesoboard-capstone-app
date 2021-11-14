import React from 'react'

const CheckMark = ({ className, height, width }) =>
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.26908 7.21262L0.140949 4.16184C-0.046983 3.97856 -0.046983 3.68138 0.140949 3.49808L0.821524 2.83431C1.00946 2.65101 1.31419 2.65101 1.50212 2.83431L3.60937 4.88944L8.12288 0.487561C8.31081 0.304276 8.61554 0.304276 8.80348 0.487561L9.48405 1.15133C9.67198 1.33461 9.67198 1.63179 9.48405 1.81509L3.94967 7.21264C3.76172 7.39592 3.45701 7.39592 3.26908 7.21262Z"
      fill="white"
    />
  </svg>

export default CheckMark

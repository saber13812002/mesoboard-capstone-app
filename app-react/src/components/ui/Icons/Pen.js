import React from 'react'

const Pen = ({ className, height, width }) =>
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.75214 2.49663L7.94175 3.30702C7.85913 3.38964 7.72553 3.38964 7.64291 3.30702L5.69164 1.35577C5.60902 1.27315 5.60902 1.13955 5.69164 1.05693L6.50203 0.246543C6.83076 -0.082181 7.36516 -0.082181 7.69564 0.246543L8.75214 1.30303C9.08262 1.63175 9.08262 2.16615 8.75214 2.49663ZM4.99552 1.75305L0.379289 6.36925L0.00661504 8.50507C-0.0443639 8.79337 0.207015 9.04299 0.49531 8.99377L2.63115 8.61934L7.24738 4.00314C7.33 3.92052 7.33 3.78692 7.24738 3.7043L5.29612 1.75305C5.21174 1.67043 5.07814 1.67043 4.99552 1.75305V1.75305ZM2.18113 5.97372C2.08445 5.87704 2.08445 5.72235 2.18113 5.62566L4.88829 2.91852C4.98497 2.82184 5.13967 2.82184 5.23635 2.91852C5.33303 3.01521 5.33303 3.1699 5.23635 3.26658L2.52919 5.97372C2.43251 6.07041 2.27781 6.07041 2.18113 5.97372V5.97372ZM1.54653 7.4521H2.39032V8.09021L1.25648 8.28885L0.709773 7.74215L0.908415 6.60832H1.54653V7.4521Z"
      fill="black"
    />
  </svg>

export default Pen

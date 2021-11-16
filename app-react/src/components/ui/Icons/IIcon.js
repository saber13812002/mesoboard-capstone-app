import './IIcon.css'
import Pen from './Pen'
import CheckMark from './CheckMark'

/** This component is used whenever the Icon component is unable to work for some reason.
 *  This component svgs that are not imported from React Icons.
 *  *Tip: you can get the svg tag of a particular icon by exporting it from figma. 
 */
const IIcon = (props) => {
  let TheIcon = <div />

  switch (props.name.toLowerCase()) {
    case 'pen':
      TheIcon = <Pen {...props} color='primary' />; break;
    case 'checkmark':
      TheIcon = <CheckMark {...props} />; break;
    default:
      return TheIcon
  }

  return <div className={`iicon ${props.color}`}>
    {TheIcon}
  </div>
}

export default IIcon

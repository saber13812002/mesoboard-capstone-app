import { Icon, iconComponents } from '../..';

const BackButton = (props) =>
  <div className='d-inline-block' {...props}>
    <div className='dark-gray circular-btn d-flex align-items-center d-inline-block mb-3'>
      <Icon
        color='light'
        size='sm'
        className='mr-1'
        IconComponent={iconComponents.ChevronLeft}
      />
      Volver
    </div>
  </div>

export default BackButton

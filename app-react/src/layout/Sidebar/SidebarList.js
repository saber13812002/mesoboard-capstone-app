import './SidebarList.css'
import { NavLink } from 'react-router-dom'
import {
  Icon,
  ICON_OPTIONS
} from '../../components'

const SidebarList = () => {
  const styles = {
    className: 'cname',
    activeClassName: 'acn'
  }

  const links = [
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/home',
      name: 'Home',
      icon: ICON_OPTIONS.home,
    },
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/schedule',
      name: 'Schedule',
      icon: ICON_OPTIONS.clock,
    },
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/profiles',
      name: 'Perfiles',
      icon: ICON_OPTIONS.user,
    },
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/checks',
      name: 'Talonarios',
      icon: ICON_OPTIONS.money,
    },
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/request',
      name: 'Solicitudes',
      icon: ICON_OPTIONS.pencil,
    },
    {
      className: styles.className,
      activeClassName: styles.activeClassName,
      to: '/app/memo',
      name: 'Memorandos',
      icon: ICON_OPTIONS.note,
    },

  ]





  return (
    <div className="sidebarList">
      <ul>
        {links.map(({ className, activeClassName, to, icon, name }, i) =>
          <li key={i}>
            <NavLink id="link" className={className} activeClassName={activeClassName} to={to}>
              <Icon icon={icon} className='mr-2' />
              <span>{name}</span>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SidebarList
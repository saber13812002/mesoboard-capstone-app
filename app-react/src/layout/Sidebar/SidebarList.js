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
      to: '/app/home',
      name: 'Home',
      icon: ICON_OPTIONS.home,
    },
    {
      to: '/app/schedule',
      name: 'Schedule',
      icon: ICON_OPTIONS.clock,
    },
    {
      to: '/app/profiles',
      name: 'Perfiles',
      icon: ICON_OPTIONS.user,
    },
    {
      to: '/app/checks',
      name: 'Talonarios',
      icon: ICON_OPTIONS.money,
    },
    {
      to: '/app/request',
      name: 'Solicitudes',
      icon: ICON_OPTIONS.pencil,
    },
    {
      to: '/app/memo',
      name: 'Memorandos',
      icon: ICON_OPTIONS.note,
    },
    {
      to: '/app/permissions',
      name: 'Permisos de Usuario',
      icon: ICON_OPTIONS.note,
    },
  ]

  return (
    <div className="sidebarList">
      <ul>
        {links.map(({ to, icon, name }, i) =>
          <li key={i}>
            <NavLink
              id="link"
              className={styles.className}
              activeClassName={styles.activeClassName}
              to={to}
            >
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
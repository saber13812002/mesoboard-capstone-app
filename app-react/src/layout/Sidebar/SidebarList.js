import { useState, useEffect } from 'react'
import './SidebarList.css'
import { NavLink } from 'react-router-dom'
import { Icon, iconComponents } from '../../components'
import { urlPaths } from '../../services/urlService'
import { sidebarItemNames, setSidebarActiveItemNameByUrlPath } from '../../services/sidebarService'

const SidebarList = () => {
  const [activeItemName, setActiveItemName] = useState(sidebarItemNames.home)
  const [hoveredItemName, setHoveredItemName] = useState(undefined)

  useEffect(() => {
    setSidebarActiveItemNameByUrlPath(setActiveItemName)
  }, [])

  const styles = {
    activeClassName: 'activeClassName'
  }

  const links = [
    {
      to: urlPaths.home,
      name: sidebarItemNames.home,
      IconComponent: iconComponents.Home,
    },
    {
      to: urlPaths.schedule,
      name: sidebarItemNames.schedule,
      IconComponent: iconComponents.Calendar,
    },
    {
      to: urlPaths.profiles,
      name: sidebarItemNames.profiles,
      IconComponent: iconComponents.Profile,
    },
    {
      to: urlPaths.checks,
      name: sidebarItemNames.checks,
      IconComponent: iconComponents.MoneyCheck,
    },
    {
      to: urlPaths.requests,
      name: sidebarItemNames.requests,
      IconComponent: iconComponents.Requests,
    },
    {
      to: urlPaths.memos,
      name: sidebarItemNames.memos,
      IconComponent: iconComponents.Memos,
    },
    {
      to: urlPaths.permissions,
      name: sidebarItemNames.permissions,
      IconComponent: iconComponents.Permissions,
    },
  ]

  return (
    <div className="sidebarList">
      <ul>
        {links.map(({ to, IconComponent, name }, i) =>
          <li
            key={i}
            onMouseEnter={() => setHoveredItemName(name)}
            onMouseLeave={() => setHoveredItemName(undefined)}
          >
            <NavLink
              to={to}
              activeClassName={styles.activeClassName}
              onClick={() => setActiveItemName(name)}
            >
              <div className='d-flex align-items-center'>
                <Icon
                  IconComponent={IconComponent}
                  color='grey'
                  size='md'
                  isSidebarItemActive={(activeItemName == name) || (hoveredItemName == name)}
                  className='mr-2'
                />
                <span>{name}</span>
              </div>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SidebarList
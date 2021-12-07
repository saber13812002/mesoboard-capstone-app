import { useState, useEffect } from 'react'
import './SidebarList.css'
import { NavLink } from 'react-router-dom'
import { Icon } from '../../components'
import { sidebarItemNames, setSidebarActiveItemNameByUrlPath } from '../../services/sidebarService'

const SidebarList = ({ sidebarItems }) => {
  const [activeItemName, setActiveItemName] = useState(sidebarItemNames.schedule)
  const [hoveredItemName, setHoveredItemName] = useState(undefined)

  useEffect(() => {
    setSidebarActiveItemNameByUrlPath(setActiveItemName)
  }, [])

  return (
    <div className="sidebarList">
      <ul>
        {sidebarItems.map(({ to, IconComponent, name }, i) =>
          <li
            key={i}
            onMouseEnter={() => setHoveredItemName(name)}
            onMouseLeave={() => setHoveredItemName(undefined)}
          >
            <NavLink
              to={to}
              activeClassName='activeClassName'
              onClick={() => setActiveItemName(name)}
            >
              <div className='d-flex align-items-center'>
                <Icon
                  IconComponent={IconComponent}
                  color='grey'
                  size='md'
                  isSidebarItemActive={(activeItemName === name) || (hoveredItemName === name)}
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
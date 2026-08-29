import React, { useState } from 'react'
import { navbarStylesDr as ns } from '../../assets/dummyStyles'
import logoImg from '../../assets/logo.png'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, UserCog, LogOut, Menu } from 'lucide-react'
import { doctorTokenStore, doctorInfoStore } from '../../utils/api'

const links = [
  { name: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointments", path: "/doctor/appointments", icon: CalendarCheck },
  { name: "Profile", path: "/doctor/profile", icon: UserCog },
]

const DoctorNavbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    doctorTokenStore.clear()
    doctorInfoStore.clear()
    navigate("/doctor-login")
  }

  return (
    <>
      <nav className={ns.navContainer}>
        <div className={ns.leftBrand}>
          <div className={ns.logoContainer}>
            <img src={logoImg} alt="MediCare" className={ns.logoImage} />
          </div>
          <div className={ns.brandTextContainer}>
            <p className={ns.brandTitle}>MediCare</p>
            <p className={ns.brandSubtitle}>Doctor Portal</p>
          </div>
        </div>

        <div className={ns.desktopMenu}>
          <div className={ns.desktopMenuItems}>
            {links.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) => `${ns.baseLink} ${isActive ? ns.activeLink : ns.inactiveLink}`}
              >
                <span className={ns.linkContent}>
                  <l.icon size={16} className={ns.linkIcon} />
                  <span className={ns.linkText}>{l.name}</span>
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className={ns.rightActions}>
          <button onClick={handleLogout} className={ns.logoutButtonDesktop}>
            <LogOut size={16} /> Logout
          </button>
          <button className={ns.hamburgerButtonMd} onClick={() => setOpen(!open)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <div className={ns.mobileMenuContainer(open)}>
        <div className={ns.mobileMenuContent}>
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `${ns.mobileBaseLink} ${isActive ? ns.mobileActiveLink : ns.mobileInactiveLink}`}
            >
              <l.icon size={16} /> {l.name}
            </NavLink>
          ))}
          <button onClick={handleLogout} className={ns.mobileLogoutButton}>
            <span className={ns.mobileLogoutContent}><LogOut size={16} /> Logout</span>
          </button>
        </div>
      </div>

      <div className={ns.spacer} />
    </>
  )
}

export default DoctorNavbar

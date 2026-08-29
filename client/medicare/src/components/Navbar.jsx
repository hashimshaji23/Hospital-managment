import React, { useState } from 'react'
import { navbarStyles as ns } from "../assets/dummyStyles"
import logoImg from '../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, UserCog, LogIn, CalendarCheck } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
]

const Navbar = () => {
    const [open, setOpen] = useState(false)

    return (
        <header className={ns.navbarContainer}>
            <style>{ns.animationStyles}</style>
            <div className={ns.navbarBorder} />

            <div className={ns.contentWrapper}>
                <div className={ns.flexContainer}>
                    {/* Logo */}
                    <Link to="/" className={ns.logoLink}>
                        <div className={ns.logoContainer}>
                            <div className={ns.logoImageWrapper}>
                                <img src={logoImg} alt="MediCare logo" className={ns.logoImage} />
                            </div>
                        </div>
                        <div className={ns.logoTextContainer}>
                            <div className={ns.logoTitle}>MediCare</div>
                            <div className={ns.logoSubtitle}>Health Care Solutions</div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className={ns.desktopNav}>
                        <div className={ns.navItemsContainer}>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.path === "/"}
                                    className={({ isActive }) =>
                                        `${ns.navItem} ${isActive ? ns.navItemActive : ns.navItemInactive}`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    {/* Right side */}
                    <div className={ns.rightContainer}>
                        <SignedIn>
                            <Link to="/my-appointments" className={ns.doctorAdminButton}>
                                <CalendarCheck className={ns.doctorAdminIcon} />
                                <span className={ns.doctorAdminText}>My Appointments</span>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <SignedOut>
                            <Link to="/doctor-login" className={ns.doctorAdminButton}>
                                <UserCog className={ns.doctorAdminIcon} />
                                <span className={ns.doctorAdminText}>Doctor Login</span>
                            </Link>
                            <SignInButton mode="modal">
                                <button className={`${ns.loginButton} cursor-pointer`}>
                                    <LogIn className={ns.loginIcon} />
                                    Login
                                </button>
                            </SignInButton>
                        </SignedOut>

                        {/* Mobile toggle */}
                        <button className={ns.mobileToggle} onClick={() => setOpen(!open)}>
                            {open ? <X className={ns.toggleIcon} /> : <Menu className={ns.toggleIcon} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {open && (
                    <div className={ns.mobileMenu}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === "/"}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `${ns.mobileMenuItem} ${isActive ? ns.mobileMenuItemActive : ns.mobileMenuItemInactive}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <SignedIn>
                            <NavLink
                                to="/my-appointments"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `${ns.mobileMenuItem} ${isActive ? ns.mobileMenuItemActive : ns.mobileMenuItemInactive}`
                                }
                            >
                                My Appointments
                            </NavLink>
                            <div className="px-4 pt-2">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>

                        <SignedOut>
                            <Link
                                to="/doctor-login"
                                onClick={() => setOpen(false)}
                                className={ns.mobileDoctorAdminButton}
                            >
                                <UserCog className="w-4 h-4" /> Doctor Login
                            </Link>
                            <div className={ns.mobileLoginContainer}>
                                <SignInButton mode="modal">
                                    <button className={ns.mobileLoginButton} onClick={() => setOpen(false)}>
                                        <LogIn className="w-4 h-4" /> Login
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar

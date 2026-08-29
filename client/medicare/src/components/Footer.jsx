import React, { useState } from 'react'
import { footerStyles as fs } from '../assets/dummyStyles'
import logoImg from '../assets/logo.png'
import { Link } from 'react-router-dom'
import {
  Stethoscope, MapPin, Phone, Mail, Globe, MessageCircle, Camera,
  Briefcase, Play, ChevronRight, Send, Heart,
} from 'lucide-react'

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Doctors", path: "/doctors" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
]

const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail("")
  }

  return (
    <footer className={fs.footerContainer}>
      <style>{fs.animationStyles}</style>

      <div className={fs.floatingIcon1}>
        <Stethoscope className={fs.stethoscopeIcon} />
      </div>

      <div className={fs.mainContent}>
        <div className={fs.gridContainer}>

          {/* Company */}
          <div className={fs.companySection}>
            <div className={fs.logoContainer}>
              <div className={fs.logoImageContainer}>
                <img src={logoImg} alt="MediCare" className={fs.logoImage} />
              </div>
              <div>
                <div className={fs.companyName}>MediCare</div>
                <div className={fs.companyTagline}>Your Health Schedule</div>
              </div>
            </div>
            <p className={fs.companyDescription}>
              Book trusted doctors and health services in a few clicks. Quality care, whenever you need it.
            </p>
            <div className={fs.contactContainer}>
              <div className={fs.contactItem}>
                <span className={fs.contactIconWrapper}><MapPin className={fs.contactIcon} /></span>
                <span className={fs.contactText}>123 Wellness Ave, Kochi, Kerala</span>
              </div>
              <div className={fs.contactItem}>
                <span className={fs.contactIconWrapper}><Phone className={fs.contactIcon} /></span>
                <span className={fs.contactText}>+91 98765 43210</span>
              </div>
              <div className={fs.contactItem}>
                <span className={fs.contactIconWrapper}><Mail className={fs.contactIcon} /></span>
                <span className={fs.contactText}>support@medicare.com</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className={fs.linksSection}>
            <h3 className={fs.sectionTitle}>Quick Links</h3>
            <ul className={fs.linksList}>
              {quickLinks.map((l) => (
                <li key={l.path} className={fs.linkItem}>
                  <Link to={l.path} className={fs.quickLink}>
                    <span className={fs.quickLinkIconWrapper}>
                      <ChevronRight className={fs.quickLinkIcon} />
                    </span>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={fs.linksSection}>
            <h3 className={fs.sectionTitle}>Explore</h3>
            <ul className={fs.linksList}>
              <li className={fs.linkItem}>
                <Link to="/services" className={fs.serviceLink}>
                  <span className={fs.serviceIcon} />
                  Health Services
                </Link>
              </li>
              <li className={fs.linkItem}>
                <Link to="/doctor-login" className={fs.serviceLink}>
                  <span className={fs.serviceIcon} />
                  Doctor Login
                </Link>
              </li>
              <li className={fs.linkItem}>
                <Link to="/my-appointments" className={fs.serviceLink}>
                  <span className={fs.serviceIcon} />
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={fs.newsletterSection}>
            <h3 className={fs.newsletterTitle}>Stay Updated</h3>
            <p className={fs.newsletterDescription}>Get health tips and updates in your inbox.</p>

            <form onSubmit={handleSubscribe} className={fs.newsletterForm}>
              <div className={fs.mobileNewsletterContainer}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className={fs.emailInput}
                />
                <button type="submit" className={fs.mobileSubscribeButton}>
                  <Send className={fs.mobileButtonIcon} />
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div>

              <div className={fs.desktopNewsletterContainer}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className={fs.desktopEmailInput}
                />
                <button type="submit" className={fs.desktopSubscribeButton}>
                  <Send className={fs.desktopButtonIcon} />
                  <span className={fs.desktopButtonText}>{subscribed ? "Subscribed!" : "Subscribe"}</span>
                </button>
              </div>
            </form>

            <div className={fs.socialContainer}>
              {[Globe, MessageCircle, Camera, Briefcase, Play].map((Icon, i) => (
                <a key={i} href="#" className={fs.socialLink}>
                  <span className={fs.socialIconBackground} />
                  <Icon className={fs.socialIcon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={fs.bottomSection}>
          <p className={fs.copyright}>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
          <p className={fs.designerText}>
            Made with <Heart className="w-4 h-4 text-rose-500" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import { contactPageStyles as cs } from '../assets/dummyStyles'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const Contact = () => {
  return (
    <div className={cs.pageContainer}>
      <div className={cs.bgAccent1} />
      <div className={cs.bgAccent2} />

      <div className="max-w-4xl mx-auto relative z-10 py-6">
        <div className="text-center mb-10">
          <h1 className={cs.formTitle}>Get in Touch</h1>
          <p className={cs.formSubtitle}>We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className={cs.infoCard}>
            <h3 className={cs.infoTitle}>Contact Info</h3>
            <div className={cs.infoItem}>
              <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>support@medicare.com</span>
            </div>
            <div className={cs.infoItem}>
              <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className={cs.infoItem}>
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>123 Wellness Ave, Kochi, Kerala</span>
            </div>
          </div>

          <div className={cs.hoursContainer}>
            <h4 className={cs.hoursTitle}>
              <Clock className="w-5 h-5 inline mr-2 text-emerald-700" />
              Working Hours
            </h4>
            <div className="mt-4 space-y-2">
              <p className={cs.hoursText}><span className="font-semibold text-emerald-900">Mon–Sat:</span> 8:00 AM – 8:00 PM</p>
              <p className={cs.hoursText}><span className="font-semibold text-emerald-900">Sunday:</span> Emergency only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

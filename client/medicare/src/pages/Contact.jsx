import React, { useState } from 'react'
import { contactPageStyles as cs } from '../assets/dummyStyles'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    if (!form.message.trim()) errs.message = "Message is required"
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSent(true)
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className={cs.pageContainer}>
      <div className={cs.bgAccent1} />
      <div className={cs.bgAccent2} />

      <div className={cs.gridContainer}>
        <div className={cs.formContainer}>
          <h1 className={cs.formTitle}>Get in Touch</h1>
          <p className={cs.formSubtitle}>We'd love to hear from you.</p>

          <form onSubmit={handleSubmit} className={cs.formSpace}>
            <div>
              <label className={cs.label}>Name</label>
              <input className={cs.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className={cs.error}>{errors.name}</p>}
            </div>
            <div>
              <label className={cs.label}>Email</label>
              <input className={cs.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className={cs.error}>{errors.email}</p>}
            </div>
            <div>
              <label className={cs.label}>Message</label>
              <textarea rows={5} className={cs.textarea} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <p className={cs.error}>{errors.message}</p>}
            </div>

            <div className={cs.buttonContainer}>
              <button type="submit" className={cs.button}>
                <Send className="w-4 h-4" /> Send Message
              </button>
              {sent && <span className={cs.sentMessage}>Thanks! We'll get back to you soon.</span>}
            </div>
          </form>
        </div>

        <div className={cs.infoContainer}>
          <div className={cs.infoCard}>
            <h3 className={cs.infoTitle}>Contact Info</h3>
            <div className={cs.infoItem}><Mail className="w-4 h-4" /> support@medicare.com</div>
            <div className={cs.infoItem}><Phone className="w-4 h-4" /> +91 98765 43210</div>
            <div className={cs.infoItem}><MapPin className="w-4 h-4" /> 123 Wellness Ave, Kochi, Kerala</div>
          </div>

          <iframe
            title="map"
            className={cs.map}
            src="https://www.google.com/maps?q=Kochi,Kerala&output=embed"
          />

          <div className={cs.hoursContainer}>
            <h4 className={cs.hoursTitle}><Clock className="w-4 h-4 inline mr-1" /> Working Hours</h4>
            <p className={cs.hoursText}>Mon–Sat: 8:00 AM – 8:00 PM</p>
            <p className={cs.hoursText}>Sunday: Emergency only</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

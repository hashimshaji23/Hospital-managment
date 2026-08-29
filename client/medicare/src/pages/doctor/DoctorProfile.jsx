import React, { useEffect, useRef, useState } from 'react'
import { editProfilePageStyles as es } from '../../assets/dummyStyles'
import {
  Camera, Edit3, Save, X, Star, Wallet, Users, Award, Plus, Trash2,
  CalendarDays, Clock, CheckCircle, AlertCircle,
} from 'lucide-react'
import { doctorInfoStore, doctorTokenStore } from '../../utils/api'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

const DoctorProfile = () => {
  const stored = doctorInfoStore.get()
  const token = doctorTokenStore.get()
  const fileInputRef = useRef(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(stored?.imageUrl || "")

  const [form, setForm] = useState({
    specialization: stored?.specialization || "",
    experience: stored?.experience || "",
    qualifications: stored?.qualifications || "",
    location: stored?.location || "",
    fee: stored?.fee || 0,
    about: stored?.about || "",
    rating: stored?.rating || 0,
    patients: stored?.patients || "",
  })
  const [availability, setAvailability] = useState(stored?.availability === "Available")
  const [schedule, setSchedule] = useState(stored?.schedule || {})
  const [newDate, setNewDate] = useState("")
  const [newSlot, setNewSlot] = useState({})

  const showToast = (type, text) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const addDate = () => {
    if (!newDate || schedule[newDate]) return
    setSchedule({ ...schedule, [newDate]: [] })
    setNewDate("")
  }

  const removeDate = (date) => {
    const copy = { ...schedule }
    delete copy[date]
    setSchedule(copy)
  }

  const addSlot = (date) => {
    const value = (newSlot[date] || "").trim()
    if (!value) return
    setSchedule({ ...schedule, [date]: [...(schedule[date] || []), value] })
    setNewSlot({ ...newSlot, [date]: "" })
  }

  const removeSlot = (date, slot) => {
    setSchedule({ ...schedule, [date]: schedule[date].filter((s) => s !== slot) })
  }

  const handleToggleAvailability = () => {
    if (!editing) return
    setAvailability(!availability)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append("availability", availability ? "Available" : "Unavailable")
      fd.append("schedule", JSON.stringify(schedule))
      if (imageFile) fd.append("image", imageFile)

      const res = await fetch(`${BASE_URL}/doctors/${stored._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed")

      doctorInfoStore.set(data.data)
      showToast("success", "Profile updated successfully")
      setEditing(false)
    } catch (err) {
      showToast("error", err.message || "Could not update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={es.pageContainer}>
      {toast && (
        <div className={es.toastContainer}>
          <div className={`${es.toastBase} ${toast.type === "success" ? es.toastSuccess : es.toastError}`}>
            {toast.type === "success"
              ? <CheckCircle className={`${es.toastIcon} ${es.toastSuccessIcon}`} />
              : <AlertCircle className={`${es.toastIcon} ${es.toastErrorIcon}`} />}
            <span className={es.toastText}>{toast.text}</span>
          </div>
        </div>
      )}

      <div className={es.maxWidthContainer}>
        <div className={es.mainCard}>
          <div className={es.headerBackground} />

          <div className={es.imageContainer}>
            <div className={es.imageWrapper}>
              {imagePreview ? (
                <img src={imagePreview} alt={stored?.name} className={es.profileImage} />
              ) : (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-emerald-100 border-4 border-white shadow-2xl flex items-center justify-center text-emerald-400">
                  <Users className="w-10 h-10" />
                </div>
              )}
              <button
                disabled={!editing}
                onClick={() => fileInputRef.current?.click()}
                className={es.imageEditButton(editing)}
              >
                <Camera className={es.imageEditIcon(editing)} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className={es.imageInput} onChange={handleImageChange} />
            </div>
          </div>

          <div className={es.profileContent}>
            <div className={es.profileHeader}>
              <div className={es.profileInfo}>
                <h1 className={es.profileName}>{stored?.name}</h1>
                <p className={es.profileSubtitle}>{form.specialization}</p>

                <div className={es.statsContainer}>
                  <div className={es.ratingStatItem}>
                    <Star className={`${es.statIcon} text-amber-500 fill-amber-500`} />
                    <div>
                      <p className={es.statAmberLabel}>Rating</p>
                      <p className={es.statAmberValue}>{form.rating || "New"}</p>
                    </div>
                  </div>
                  <div className={es.feeStatItem}>
                    <Wallet className={`${es.statIcon} text-amber-600`} />
                    <div>
                      <p className={es.statAmberLabel}>Fee</p>
                      <p className={es.statAmberValue}>₹{form.fee}</p>
                    </div>
                  </div>
                  <div className={es.statItem}>
                    <Award className={`${es.statIcon} ${es.statEmeraldIcon}`} />
                    <div>
                      <p className={es.statLabel}>Experience</p>
                      <p className={es.statValue}>{form.experience || "New"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={es.actionButtons}>
                <div onClick={handleToggleAvailability} className={es.availabilityToggle(availability)}>
                  <span className={es.toggleTrack(availability)}>
                    <span className={es.toggleThumb(availability)} />
                  </span>
                  <span className={es.toggleText(availability)}>{availability ? "Available" : "Unavailable"}</span>
                </div>

                {editing ? (
                  <button onClick={handleSave} disabled={saving} className={es.editButton}>
                    <span className={es.editButtonContent}>
                      <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                    </span>
                  </button>
                ) : (
                  <button onClick={() => setEditing(true)} className={es.editButton}>
                    <span className={es.editButtonContent}>
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className={es.formSection}>
              <h2 className={es.sectionTitle}>
                <span className={es.sectionIconContainer}><Users className={es.sectionIcon} /></span>
                Basic Information
              </h2>
              <div className={es.fieldGrid}>
                {[
                  { key: "specialization", label: "Specialization" },
                  { key: "experience", label: "Experience" },
                  { key: "qualifications", label: "Qualifications" },
                  { key: "location", label: "Location" },
                  { key: "fee", label: "Consultation Fee", type: "number" },
                  { key: "patients", label: "Patients Treated" },
                ].map((f) => (
                  <div key={f.key} className={es.fieldGroup}>
                    <label className={es.fieldLabel}>{f.label}</label>
                    <input
                      disabled={!editing}
                      type={f.type || "text"}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className={es.inputBase(editing)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className={es.fieldLabel}>About</label>
                <textarea
                  disabled={!editing}
                  rows={4}
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                  className={es.aboutTextarea(editing)}
                />
              </div>
            </div>

            {/* Schedule */}
            <div className={es.formSection}>
              <div className={es.scheduleHeader}>
                <h2 className={es.sectionTitle}>
                  <span className={es.sectionIconContainer}><CalendarDays className={es.sectionIcon} /></span>
                  Schedule
                </h2>
                {editing && (
                  <div className={es.addDateContainer}>
                    <input type="date" className={es.addDateInput} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    <button onClick={addDate} className={es.addDateButton}>
                      <Plus className={es.addDateIcon} /> Add Date
                    </button>
                  </div>
                )}
              </div>

              {Object.keys(schedule).length === 0 ? (
                <div className={es.emptySchedule}>
                  <CalendarDays className={es.emptyScheduleIcon} />
                  <p className={es.emptyScheduleText}>No schedule set up</p>
                  <p className={es.emptyScheduleSubtext}>Add a date to start creating time slots.</p>
                </div>
              ) : (
                <div className={es.scheduleGrid}>
                  {Object.entries(schedule).sort(([a], [b]) => a.localeCompare(b)).map(([date, slots]) => (
                    <div key={date} className={es.dateCard}>
                      <div className={es.dateHeader}>
                        <div className="flex items-center gap-3">
                          <span className={es.dateIconContainer}><CalendarDays className={es.dateIcon} /></span>
                          <div>
                            <p className={es.dateTitle}>{date}</p>
                            <span className={es.dateSlotCount}>{slots.length} slots</span>
                          </div>
                        </div>
                        <button disabled={!editing} onClick={() => removeDate(date)} className={es.dateDeleteButton(editing)}>
                          <Trash2 className={es.dateDeleteIcon} />
                        </button>
                      </div>

                      <div className={es.timeSlotContainer}>
                        {slots.map((slot) => (
                          <div key={slot} className={es.timeSlotItem}>
                            <span className={es.timeSlotText}><Clock className={es.timeSlotIcon} /> {slot}</span>
                            <button disabled={!editing} onClick={() => removeSlot(date, slot)} className={es.timeSlotDeleteButton(editing)}>
                              <X className={es.timeSlotDeleteIcon} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {editing && (
                        <div className={es.addSlotContainer + " flex gap-2 mt-2"}>
                          <input
                            placeholder="e.g. 10:00 AM"
                            className={es.addSlotInput}
                            value={newSlot[date] || ""}
                            onChange={(e) => setNewSlot({ ...newSlot, [date]: e.target.value })}
                          />
                          <button onClick={() => addSlot(date)} className={es.addSlotButton}>
                            <Plus className={es.addSlotIcon} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {editing && (
              <div className={es.actionsSection}>
                <span className={es.actionsText}>Remember to save your changes.</span>
                <div className={es.actionsButtons}>
                  <button onClick={() => setEditing(false)} className={es.resetButton}>Cancel</button>
                  <button onClick={handleSave} disabled={saving} className={es.saveButton}>
                    <span className={es.saveButtonContent}>
                      {saving && <span className={es.saveSpinner} />}
                      Save Changes
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile

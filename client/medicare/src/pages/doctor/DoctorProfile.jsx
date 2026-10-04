import React, { useEffect, useRef, useState } from 'react'
import { editProfilePageStyles as es } from '../../assets/dummyStyles'
import {
  Camera, Edit3, Save, Star, Wallet, Users, Award, Plus, Trash2,
  CalendarDays, Clock, CheckCircle, AlertCircle, X,
} from 'lucide-react'
import { api, doctorInfoStore } from '../../utils/api'
import { formatDoctorTimeString } from '../../utils/format'

const emptyForm = {
  name: "",
  specialization: "",
  experience: "",
  qualifications: "",
  location: "",
  fee: 0,
  about: "",
  patients: "",
}

const DoctorProfile = () => {
  const stored = doctorInfoStore.get()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [doctor, setDoctor] = useState(stored)
  const [form, setForm] = useState(emptyForm)
  const [availability, setAvailability] = useState(true)
  const [schedule, setSchedule] = useState({})
  const [newDate, setNewDate] = useState("")
  const [newSlot, setNewSlot] = useState({})
  const [snapshot, setSnapshot] = useState(null)

  const showToast = (type, text) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  const applyDoctor = (d) => {
    const nextForm = {
      name: d.name || "",
      specialization: d.specialization || "",
      experience: d.experience || "",
      qualifications: d.qualifications || "",
      location: d.location || "",
      fee: d.fee ?? 0,
      about: d.about || "",
      patients: d.patients || "",
    }
    const nextAvail = d.availability !== "Unavailable"
    const nextSchedule = d.schedule && typeof d.schedule === "object" ? d.schedule : {}
    setDoctor(d)
    setForm(nextForm)
    setAvailability(nextAvail)
    setSchedule(nextSchedule)
    setImagePreview(d.imageUrl || "")
    setImageFile(null)
    return { form: nextForm, availability: nextAvail, schedule: nextSchedule, imagePreview: d.imageUrl || "" }
  }

  const load = async () => {
    if (!stored?._id) {
      setError("Doctor session not found. Please log in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/doctors/${stored._id}`)
      const d = res.data
      applyDoctor(d)
      doctorInfoStore.set(d)
    } catch (err) {
      if (stored) applyDoctor(stored)
      setError(err.message || "Could not load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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
    const value = formatDoctorTimeString(newSlot[date] || "")
    if (!value) return
    const existing = schedule[date] || []
    if (existing.includes(value)) return
    setSchedule({ ...schedule, [date]: [...existing, value] })
    setNewSlot({ ...newSlot, [date]: "" })
  }

  const removeSlot = (date, slot) => {
    setSchedule({ ...schedule, [date]: (schedule[date] || []).filter((s) => s !== slot) })
  }

  const startEditing = () => {
    setSnapshot({ form, availability, schedule, imagePreview })
    setEditing(true)
  }

  const cancelEditing = () => {
    if (snapshot) {
      setForm(snapshot.form)
      setAvailability(snapshot.availability)
      setSchedule(snapshot.schedule)
      setImagePreview(snapshot.imagePreview)
      setImageFile(null)
    }
    setEditing(false)
  }

  const handleSave = async () => {
    if (!stored?._id) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""))
      fd.append("availability", availability ? "Available" : "Unavailable")
      fd.append("schedule", JSON.stringify(schedule))
      if (imageFile) fd.append("image", imageFile)

      const res = await api.put(`/doctors/${stored._id}`, fd, { isForm: true })
      const d = res.data
      applyDoctor(d)
      doctorInfoStore.set(d)
      showToast("success", "Profile updated successfully")
      setEditing(false)
    } catch (err) {
      showToast("error", err.message || "Could not update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={es.loadingContainer}>
        <div>
          <div className={es.loadingSpinner} />
          <p className={es.loadingText}>Loading profile...</p>
        </div>
      </div>
    )
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
        {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
        <div className={es.mainCard}>
          <div className={es.headerBackground} />

          <div className={es.imageContainer}>
            <div className={es.imageWrapper}>
              {imagePreview ? (
                <img src={imagePreview} alt={form.name} className={es.profileImage} />
              ) : (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-emerald-100 border-4 border-white shadow-2xl flex items-center justify-center text-emerald-400">
                  <Users className="w-10 h-10" />
                </div>
              )}
              <button
                type="button"
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
                <h1 className={es.profileName}>{form.name || doctor?.name}</h1>
                <p className={es.profileSubtitle}>{form.specialization || "Specialization not set"}</p>

                <div className={es.statsContainer}>
                  <div className={es.ratingStatItem}>
                    <Star className={`${es.statIcon} text-amber-500 fill-amber-500`} />
                    <div>
                      <p className={es.statAmberLabel}>Rating</p>
                      <p className={es.statAmberValue}>{doctor?.rating || "New"}</p>
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
                <div onClick={() => editing && setAvailability(!availability)} className={es.availabilityToggle(availability)}>
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
                  <button onClick={startEditing} className={es.editButton}>
                    <span className={es.editButtonContent}>
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className={es.formSection}>
              <h2 className={es.sectionTitle}>
                <span className={es.sectionIconContainer}><Users className={es.sectionIcon} /></span>
                Basic Information
              </h2>
              <div className={es.fieldGrid}>
                {[
                  { key: "name", label: "Full Name" },
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

            <div className={es.formSection}>
              <div className={es.scheduleHeader}>
                <h2 className={es.sectionTitle}>
                  <span className={es.sectionIconContainer}><CalendarDays className={es.sectionIcon} /></span>
                  Schedule
                </h2>
                {editing && (
                  <div className={es.addDateContainer}>
                    <input type="date" className={es.addDateInput} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    <button type="button" onClick={addDate} className={es.addDateButton}>
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
                            <span className={es.dateSlotCount}>{(slots || []).length} slots</span>
                          </div>
                        </div>
                        <button type="button" disabled={!editing} onClick={() => removeDate(date)} className={es.dateDeleteButton(editing)}>
                          <Trash2 className={es.dateDeleteIcon} />
                        </button>
                      </div>

                      <div className={es.timeSlotContainer}>
                        {(slots || []).map((slot) => (
                          <div key={slot} className={es.timeSlotItem}>
                            <span className={es.timeSlotText}><Clock className={es.timeSlotIcon} /> {slot}</span>
                            <button type="button" disabled={!editing} onClick={() => removeSlot(date, slot)} className={es.timeSlotDeleteButton(editing)}>
                              <X className={es.timeSlotDeleteIcon} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {editing && (
                        <div className={`${es.addSlotContainer} flex gap-2 mt-2`}>
                          <input
                            type="time"
                            className={es.addSlotInput}
                            value={newSlot[date] || ""}
                            onChange={(e) => setNewSlot({ ...newSlot, [date]: e.target.value })}
                          />
                          <button type="button" onClick={() => addSlot(date)} className={es.addSlotButton}>
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
                  <button type="button" onClick={cancelEditing} className={es.resetButton}>Cancel</button>
                  <button type="button" onClick={handleSave} disabled={saving} className={es.saveButton}>
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

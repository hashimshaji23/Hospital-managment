import React, { useEffect, useState } from 'react'
import { doctorsPageStyles as ds } from '../assets/dummyStyles'
import { Link } from 'react-router-dom'
import { Search, X, Clock, Calendar, Users } from 'lucide-react'
import { api } from '../utils/api'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  const loadDoctors = async (q = "") => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      setDoctors(res.data || res.doctors || [])
    } catch (err) {
      setError(err.message || "Could not load doctors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [])

  useEffect(() => {
    const t = setTimeout(() => loadDoctors(query), 350)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className={ds.mainContainer}>
      <div className={ds.backgroundShape1} />
      <div className={ds.backgroundShape2} />

      <div className={ds.wrapper}>
        <div className={ds.headerContainer}>
          <h1 className={ds.headerTitle}>Find Your Doctor</h1>
          <p className={ds.headerSubtitle}>Search by name or specialization and book instantly.</p>
        </div>

        <div className={ds.searchContainer}>
          <div className={ds.searchWrapper}>
            <Search className={ds.searchIcon} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors, specializations..."
              className={ds.searchInput}
            />
            {query && (
              <button className={ds.clearButton} onClick={() => setQuery("")}>
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={ds.errorContainer}>
            <p className={ds.errorText}>{error}</p>
            <button className={ds.retryButton} onClick={() => loadDoctors(query)}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className={ds.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={ds.skeletonCard}>
                <div className={ds.skeletonImage} />
                <div className={ds.skeletonName} />
                <div className={ds.skeletonSpecialization} />
                <div className={ds.skeletonButton} />
              </div>
            ))}
          </div>
        ) : (
          <div className={ds.doctorsGrid}>
            {doctors.map((doc) => {
              const available = doc.availability !== "Unavailable"
              return (
                <div key={doc._id || doc.id} className={`${ds.doctorCard} ${!available ? ds.doctorCardUnavailable : ""} group`}>
                  <div className={`${ds.imageContainer} ${!available ? ds.imageContainerUnavailable : ""}`}>
                    {doc.imageUrl ? (
                      <img src={doc.imageUrl} alt={doc.name} className={available ? ds.doctorImage : ds.doctorImageUnavailable} />
                    ) : (
                      <div className="w-full h-full rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center text-emerald-300">
                        <Users className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <h3 className={ds.doctorName}>{doc.name}</h3>
                  <p className={ds.doctorSpecialization}>{doc.specialization}</p>
                  <span className={ds.experienceBadge}>
                    <Clock className={ds.experienceIcon} /> {doc.experience || "New"}
                  </span>
                  {available ? (
                    <Link to={`/doctors/${doc._id || doc.id}`} className={ds.bookButton}>
                      <Calendar className={ds.bookButtonIcon} /> Book Appointment
                    </Link>
                  ) : (
                    <span className={ds.notAvailableButton}>
                      Not Available
                    </span>
                  )}
                </div>
              )
            })}
            {!doctors.length && (
              <div className={ds.noResults}>No doctors found. Try a different search.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors

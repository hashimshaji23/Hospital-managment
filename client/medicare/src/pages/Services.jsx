import React, { useEffect, useState } from 'react'
import { servicePageStyles as ss, serviceCardStyles as cs } from '../assets/dummyStyles'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/services")
      setServices(res.data || res.services || [])
    } catch (err) {
      setError(err.message || "Could not load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className={ss.pageContainer}>
      <div className={ss.maxWidthContainer}>
        <div className={ss.header}>
          <h1 className={ss.title}>Our Health Services</h1>
          <p className={ss.subtitle}>Preventive care, diagnostics, and specialist services under one roof.</p>
        </div>

        {error && (
          <div className={ss.errorContainer}>
            <p className={ss.errorText}>{error}</p>
            <button className={ss.retryButton} onClick={load}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className={ss.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={ss.skeletonCard}>
                <div className={ss.skeletonImage} />
                <div className={ss.skeletonText1} />
                <div className={ss.skeletonText2} />
                <div className={ss.skeletonButton} />
              </div>
            ))}
          </div>
        ) : (
          <div className={ss.servicesGrid}>
            {services.map((svc) => (
              <div key={svc._id} className={cs.card}>
                <div className={cs.imageContainer}>
                  {svc.imageUrl ? (
                    <img src={svc.imageUrl} alt={svc.name} className={cs.responsiveImage} />
                  ) : (
                    <div className={cs.fallbackImage + " bg-blue-50"} />
                  )}
                </div>
                <div className={cs.content}>
                  <h3 className={cs.serviceName}>{svc.name}</h3>
                  <div className={cs.buttonContainer}>
                    {svc.available !== false ? (
                      <Link to={`/services/${svc._id}`} className={cs.buttonAvailable}>
                        ₹{svc.price} · Book Now
                      </Link>
                    ) : (
                      <span className={cs.buttonUnavailable}>Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!services.length && (
              <div className={ss.emptyState}>No services available yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Services

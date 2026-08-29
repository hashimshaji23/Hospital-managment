import React, { useEffect, useState } from 'react'
import { bannerStyles as bs, homeDoctorsStyles as hs } from '../assets/dummyStyles'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, Star, ShieldCheck, Clock, Users, Phone, Calendar, RefreshCw } from 'lucide-react'
import { api } from '../utils/api'
import BannerImg from '../assets/BannerImg.png'

const Home = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDoctors = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/doctors?limit=8")
      setDoctors(res.data || res.doctors || [])
    } catch (err) {
      setError(err.message || "Could not load doctors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [])

  const features = [
    { icon: ShieldCheck, text: "Verified Doctors", border: bs.featureBorderGreen },
    { icon: Clock, text: "24/7 Availability", border: bs.featureBorderBlue },
    { icon: Users, text: "10k+ Happy Patients", border: bs.featureBorderEmerald },
    { icon: Calendar, text: "Instant Booking", border: bs.featureBorderPurple },
  ]

  return (
    <div>
      {/* Banner */}
      <section className={bs.bannerContainer}>
        <div className={bs.mainContainer}>
          <div className={bs.borderOutline}>
            <div className={bs.outerAnimatedBand} />
            <div className={bs.innerWhiteBorder} />
          </div>
          <div className={bs.contentContainer}>
            <div className={bs.flexContainer}>
              <div className={bs.leftContent}>
                <div className={bs.headerBadgeContainer}>
                  <div className={bs.stethoscopeContainer}>
                    <div className={bs.stethoscopeInner}>
                      <Stethoscope className={bs.stethoscopeIcon} />
                    </div>
                  </div>
                  <div className={bs.titleContainer}>
                    <h1 className={bs.title}>
                      <span className={bs.titleGradient}>MediCare</span>
                    </h1>
                  </div>
                </div>

                <div className={bs.starsContainer}>
                  <div className={bs.starsInner}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={bs.starIcon} />
                    ))}
                  </div>
                </div>

                <p className={bs.tagline}>
                  Book <span className={bs.taglineHighlight}>trusted doctors</span> and health
                  services, on your schedule.
                </p>

                <div className={bs.featuresGrid}>
                  {features.map((f, i) => (
                    <div key={i} className={`${bs.featureItem} ${f.border}`}>
                      <f.icon className={bs.featureIcon} />
                      <span className={bs.featureText}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className={bs.ctaButtonsContainer}>
                  <button onClick={() => navigate("/doctors")} className={bs.bookButton}>
                    <span className={bs.bookButtonOverlay} />
                    <span className={bs.bookButtonContent}>
                      <Calendar className={bs.bookButtonIcon} />
                      Book Appointment
                    </span>
                  </button>
                  <button className={bs.emergencyButton}>
                    <span className={bs.emergencyButtonContent}>
                      <Phone className={bs.emergencyButtonIcon} />
                      Emergency Call
                    </span>
                  </button>
                </div>
              </div>

              <div className={bs.rightImageSection}>
                <div className={bs.imageContainer}>
                  <div className={bs.imageFrame}>
                    <img src={BannerImg} alt="Healthcare" className={bs.image} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured doctors */}
      <section className={hs.section}>
        <div className={hs.container}>
          <div className={hs.header}>
            <h2 className={hs.title}>
              Meet our <span className={hs.titleSpan}>top doctors</span>
            </h2>
            <p className={hs.subtitle}>Experienced specialists ready to take care of you.</p>
          </div>

          {error && (
            <div className={hs.errorContainer}>
              <p className={hs.errorText}>{error}</p>
              <button onClick={loadDoctors} className={hs.retryButton}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className={hs.skeletonGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={hs.skeletonCard}>
                  <div className={hs.skeletonImage} />
                  <div className={hs.skeletonText1} />
                  <div className={hs.skeletonText2} />
                  <div className={hs.skeletonButton} />
                </div>
              ))}
            </div>
          ) : (
            <div className={hs.doctorsGrid}>
              {doctors.map((doc) => {
                const available = doc.availability !== "Unavailable"
                return (
                  <article key={doc._id || doc.id} className={hs.article}>
                    <div className={available ? hs.imageContainerAvailable : hs.imageContainerUnavailable}>
                      {doc.imageUrl ? (
                        <img src={doc.imageUrl} alt={doc.name} className={hs.image} />
                      ) : (
                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                          <Users className="w-10 h-10" />
                        </div>
                      )}
                      {!available && <span className={hs.unavailableBadge}>Unavailable</span>}
                    </div>
                    <div className={hs.cardBody}>
                      <h3 className={hs.doctorName}>{doc.name}</h3>
                      <p className={hs.specialization}>{doc.specialization}</p>
                      <div className={hs.experienceContainer}>
                        <span className={hs.experienceBadge}>{doc.experience || "New"} exp.</span>
                        <span>₹{doc.fee}</span>
                      </div>
                      <div className={hs.buttonContainer}>
                        {available ? (
                          <Link to={`/doctors/${doc._id || doc.id}`} className={hs.buttonAvailable}>
                            <Calendar className="w-4 h-4" /> Book Now
                          </Link>
                        ) : (
                          <span className={hs.buttonUnavailable}>Not Available</span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
              {!doctors.length && !loading && (
                <div className="col-span-full text-center py-10 text-emerald-700 flex flex-col items-center gap-3">
                  <RefreshCw className="w-6 h-6" />
                  No doctors available yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

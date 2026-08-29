import React, { useState } from 'react'
import { loginPageStyles as ls } from '../../assets/dummyStyles'
import logoImg from '../../assets/logo.png'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../../utils/api'
import { doctorTokenStore, doctorInfoStore } from '../../utils/api'

const DoctorLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/doctors/login", { email, password })
      doctorTokenStore.set(res.token)
      doctorInfoStore.set(res.data)
      navigate("/doctor/dashboard")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ls.mainContainer}>
      <Link to="/" className={ls.backButton}>
        <ArrowLeft className={ls.backButtonIcon} /> Back to site
      </Link>

      <div className={ls.loginCard}>
        <div className={ls.logoContainer}>
          <img src={logoImg} alt="MediCare" className={ls.logo} />
        </div>
        <h1 className={ls.title}>Doctor Login</h1>
        <p className={ls.subtitle}>Sign in to manage your appointments</p>

        <form onSubmit={handleSubmit} className={ls.form}>
          <input
            type="email"
            placeholder="Email"
            className={ls.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={ls.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-rose-600 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className={ls.submitButton}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DoctorLogin

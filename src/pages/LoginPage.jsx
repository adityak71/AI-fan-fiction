import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Sign-in error:', err)
    }
  }

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-icon"><StarIcon /></span>
        </div>

        <h1 className="login-title">
          AI <span className="login-gradient-text">FanFic</span>
        </h1>
        <p className="login-subtitle">
          Your AI-powered fan fiction universe.<br />
          Sign in to start creating stories.
        </p>

        <div className="login-features">
          <span className="login-feature-pill">💬 Text Chat</span>
          <span className="login-feature-pill">🎙️ Voice Chat</span>
          <span className="login-feature-pill">🎨 Image Gen</span>
        </div>

        <button className="login-google-btn" onClick={handleSignIn} disabled={loading}>
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>

        <p className="login-disclaimer">
          By signing in, you agree to our terms of service.<br />
          Your data is protected by Firebase Authentication.
        </p>
      </div>
    </div>
  )
}

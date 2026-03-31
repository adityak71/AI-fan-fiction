import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)

const navLinks = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/text-chat', label: 'Text Chat', emoji: '💬' },
  { to: '/voice-chat', label: 'Voice Chat', emoji: '🎙️' },
  { to: '/image-gen', label: 'Image Gen', emoji: '🎨' },
]

const Navbar = ({ theme, toggleTheme }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon"><BookIcon /></span>
          <span className="logo-text">
            AI <span className="gradient-text">FanFic</span>
          </span>
        </NavLink>

        <div className="navbar-links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              <span className="nav-link-emoji">{link.emoji}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className={`theme-icon theme-icon--${theme === 'dark' ? 'sun' : 'moon'}`}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
            <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {user ? (
            <div className="navbar-user">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="navbar-avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="navbar-username">
                {user.displayName?.split(' ')[0]}
              </span>
              <button className="navbar-signout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="navbar-signin-btn">
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar


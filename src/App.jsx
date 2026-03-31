import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TextChatPage from './pages/TextChatPage'
import VoiceChatPage from './pages/VoiceChatPage'
import ImageGenPage from './pages/ImageGenPage'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app" data-theme={theme}>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/text-chat" element={<TextChatPage />} />
              <Route path="/voice-chat" element={<VoiceChatPage />} />
              <Route path="/image-gen" element={<ImageGenPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

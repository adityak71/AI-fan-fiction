import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const features = [
  {
    emoji: '💬',
    title: 'Text Chat',
    desc: 'Type your story prompt and watch your fan fiction come alive with streaming AI responses.',
    route: '/text-chat',
    gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  },
  {
    emoji: '🎙️',
    title: 'Voice Chat',
    desc: 'Describe your story idea with your voice. Speak, and the AI will craft it for you.',
    route: '/voice-chat',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  {
    emoji: '🎨',
    title: 'Image Generation',
    desc: 'Bring your fan fiction scenes to life with AI-generated artwork and visuals.',
    route: '/image-gen',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
]

const popularFandoms = [
  '⚡ Harry Potter', '🦸 Marvel', '⭐ Star Wars', '🍃 Naruto',
  '💍 Lord of the Rings', '👑 Game of Thrones', '🌊 Percy Jackson', '🎌 Anime',
]

const HomePage = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge badge animate-fade-in">
          <span>✨</span>
          <span>Team Alpha</span>
        </div>
        <h1 className="hero-title animate-slide-up">
          Your Ultimate<br />
          <span className="gradient-text">AI Fan Fiction</span><br />
          Assistant
        </h1>
        <p className="hero-subtitle animate-slide-up">
          Generate immersive stories from your favorite universes using the power of Google Gemini.
          Text, voice, or image — your creativity, amplified.
        </p>
        <div className="hero-cta animate-slide-up">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/text-chat')}>
            <span>Start Writing</span>
            <span>→</span>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/voice-chat')}>
            <span>🎙️</span>
            <span>Try Voice</span>
          </button>
        </div>
        <div className="hero-fandoms animate-fade-in">
          {popularFandoms.map(f => (
            <span key={f} className="badge">{f}</span>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Choose Your Mode</h2>
          <p className="section-sub">Three unique ways to create your perfect fan fiction story</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className={`feature-card glass-card ${hoveredCard === idx ? 'feature-card--hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(feature.route)}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="feature-icon" style={{ background: feature.gradient }}>
                <span>{feature.emoji}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-cta">
                Try Now <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '16px' }}>How It Works</h2>
        <p className="section-sub" style={{ textAlign: 'center', marginBottom: '48px' }}>Three simple steps to your dream fan fiction</p>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Pick a Fandom', desc: 'Choose from dozens of popular fandoms or enter a custom universe.' },
            { num: '02', title: 'Describe Your Story', desc: 'Tell the AI what kind of story, characters, or scenes you want.' },
            { num: '03', title: 'Read & Enjoy', desc: 'Get a beautifully crafted, immersive fan fiction story in seconds.' },
          ].map(step => (
            <div key={step.num} className="step glass-card">
              <div className="step-num gradient-text">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage

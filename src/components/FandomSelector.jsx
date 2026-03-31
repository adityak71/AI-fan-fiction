import './FandomSelector.css'

const fandoms = [
  { id: 'harry-potter', label: 'Harry Potter', emoji: '⚡', color: '#7c3aed' },
  { id: 'marvel', label: 'Marvel', emoji: '🦸', color: '#ef4444' },
  { id: 'star-wars', label: 'Star Wars', emoji: '⭐', color: '#f59e0b' },
  { id: 'naruto', label: 'Naruto', emoji: '🍃', color: '#f97316' },
  { id: 'lord-of-rings', label: 'Lord of the Rings', emoji: '💍', color: '#10b981' },
  { id: 'game-of-thrones', label: 'Game of Thrones', emoji: '👑', color: '#8b5cf6' },
  { id: 'dc-comics', label: 'DC Comics', emoji: '🦇', color: '#3b82f6' },
  { id: 'anime', label: 'Anime (General)', emoji: '🎌', color: '#ec4899' },
  { id: 'percy-jackson', label: 'Percy Jackson', emoji: '🌊', color: '#06b6d4' },
  { id: 'custom', label: 'Custom', emoji: '✨', color: '#a78bfa' },
]

const genres = ['Adventure', 'Romance', 'Mystery', 'Comedy', 'Tragedy', 'Action', 'Drama']
const tones = ['Epic', 'Heartwarming', 'Dark', 'Humorous', 'Mysterious', 'Whimsical']

const FandomSelector = ({ selected, onSelect, genre, onGenre, tone, onTone }) => {
  return (
    <div className="fandom-selector">
      <div className="fandom-group">
        <label className="fandom-label">Choose Your Fandom</label>
        <div className="fandom-chips">
          {fandoms.map(f => (
            <button
              key={f.id}
              className={`fandom-chip ${selected === f.label ? 'fandom-chip--active' : ''}`}
              onClick={() => onSelect(f.label)}
              style={{ '--chip-color': f.color }}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fandom-row">
        <div className="fandom-group fandom-group--half">
          <label className="fandom-label">Genre</label>
          <div className="fandom-chips fandom-chips--small">
            {genres.map(g => (
              <button
                key={g}
                className={`fandom-chip fandom-chip--sm ${genre === g ? 'fandom-chip--active' : ''}`}
                onClick={() => onGenre(genre === g ? '' : g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="fandom-group fandom-group--half">
          <label className="fandom-label">Tone</label>
          <div className="fandom-chips fandom-chips--small">
            {tones.map(t => (
              <button
                key={t}
                className={`fandom-chip fandom-chip--sm ${tone === t ? 'fandom-chip--active' : ''}`}
                onClick={() => onTone(tone === t ? '' : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FandomSelector

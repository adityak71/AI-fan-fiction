const LoadingDots = ({ label = 'Generating story...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--accent-purple)',
            animation: `wave 1.2s ease-in-out ${i * 0.15}s infinite`,
            display: 'block',
          }}
        />
      ))}
    </div>
    <span>{label}</span>
  </div>
)

export default LoadingDots

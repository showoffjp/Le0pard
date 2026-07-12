import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// Self-hosted futuristic type (latin subset only)
import '@fontsource/orbitron/latin-400.css'
import '@fontsource/orbitron/latin-700.css'
import '@fontsource/orbitron/latin-900.css'
import '@fontsource/rajdhani/latin-300.css'
import '@fontsource/rajdhani/latin-400.css'
import '@fontsource/rajdhani/latin-500.css'
import '@fontsource/rajdhani/latin-600.css'
import '@fontsource/rajdhani/latin-700.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

// Last-resort safety net: if anything in the tree throws, show a branded message
// instead of a blank page (mirrors the <noscript> escape hatch in index.html).
const appFallback = (
  <div
    style={{
      minHeight: '100svh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: '#04050a',
      color: '#cbd5e1',
      fontFamily: 'Rajdhani, ui-sans-serif, system-ui, sans-serif',
    }}
  >
    <div style={{ maxWidth: '30rem' }}>
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          letterSpacing: '0.15em',
          fontSize: '1.25rem',
          color: '#fff',
        }}
      >
        LEOPARDØ — DYSTØPIA
      </div>
      <p style={{ marginTop: '0.85rem', lineHeight: 1.6 }}>
        Something glitched in the signal. Please reload — or listen on{' '}
        <a style={{ color: '#a855f7' }} href="https://leopardomusic.bandcamp.com/album/dyst-pia">
          Bandcamp
        </a>
        .
      </p>
    </div>
  </div>
)

createRoot(container).render(
  <ErrorBoundary label="app" fallback={appFallback}>
    <App />
  </ErrorBoundary>,
)

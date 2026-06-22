import { createRoot } from 'react-dom/client'
import App from './App'
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

createRoot(container).render(<App />)

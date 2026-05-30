import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'

// Resolve the hero image against Vite's base URL so it works both at the dev
// root ("/") and when deployed to a subpath like GitHub Pages ("/giuggiola/").
document.documentElement.style.setProperty(
  '--hero-img',
  `url(${import.meta.env.BASE_URL}hero.webp)`,
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

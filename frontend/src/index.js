import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './bootstrap' // Import React Bootstrap components
import './sass/custom.scss'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

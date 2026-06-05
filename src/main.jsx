/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'

import { SizeProvider } from './context/SizeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SizeProvider>
      <App />
    </SizeProvider>
  </StrictMode>,
)

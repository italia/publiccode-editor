// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
// import './index.css'

createRoot(document.getElementById('app')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)

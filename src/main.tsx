// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
// import './index.css'
import packageJson from '../package.json';

console.log(`${packageJson.name} ${packageJson.version}`);

createRoot(document.getElementById('app')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)

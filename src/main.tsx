import { Spark103Watermark } from "./spark103-watermark";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
        <Spark103Watermark />
    </StrictMode>,
)

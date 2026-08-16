import { Spark103Watermark } from "./spark103-watermark";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- SPARK103 signature banner ---
if (typeof window !== 'undefined') {
  console.log(
    '%c💡 Built with SPARK103',
    'color: #a78bfa; font-size: 16px; font-weight: bold; padding: 4px 0;'
  );
  console.log(
    '%cImagination → Spark → Innovation → Creation.\nhttps://spark103.dev',
    'color: #8b5cf6; font-size: 12px;'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
        <Spark103Watermark />
    </StrictMode>,
)

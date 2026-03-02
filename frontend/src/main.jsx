import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'


const saved = localStorage.getItem('nh-theme') || 'dark'
document.documentElement.setAttribute('data-theme', saved)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13.5px',
          borderRadius: '10px',
          padding: '11px 15px',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        },
      }}
    />
  </BrowserRouter>
)

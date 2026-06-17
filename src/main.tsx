import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully suppress benign WebSocket environment errors
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (
      reason === "WebSocket closed without opened." ||
      (reason && typeof reason === "object" && reason.message && reason.message.includes("WebSocket")) ||
      (typeof reason === "string" && reason.includes("WebSocket"))
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


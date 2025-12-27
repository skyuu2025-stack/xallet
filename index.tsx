import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handling to catch issues that lead to black screen
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error Caught:", message, error);
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical: Could not find root element '#root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to render React app:", err);
    rootElement.innerHTML = `<div style="padding: 20px; color: white; background: #0d0d0f; height: 100vh; font-family: sans-serif;">
      <h2 style="color: #0062ff;">System Error</h2>
      <p>The neural link failed to initialize. This is likely due to an asset loading error.</p>
      <button onclick="location.reload()" style="background: #0062ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">Retry Connection</button>
      <pre style="color: #ff4b5c; font-size: 11px; margin-top: 20px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow: auto;">${err instanceof Error ? err.message : String(err)}</pre>
    </div>`;
  }
}
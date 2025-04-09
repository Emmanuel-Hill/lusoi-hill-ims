
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element and create a root
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create and render the root
const root = createRoot(rootElement);
root.render(<App />);

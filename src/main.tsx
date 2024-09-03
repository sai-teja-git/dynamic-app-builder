import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import "./Main.scss"
import { Toaster } from "sonner"

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div>Loading...</div>}>
    <Toaster position='top-center' duration={1000} />
    <App />
  </Suspense>
)

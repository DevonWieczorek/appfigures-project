import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import { ErrorBoundary } from "@/components/error-boundary";
import { AppErrorFallback } from "@/components/app-error-fallback";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <ErrorBoundary fallback={<AppErrorFallback />}>
              <App />
            </ErrorBoundary>
          )}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

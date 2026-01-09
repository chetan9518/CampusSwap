import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.tsx'
import { AuthContext } from './context/authContext.tsx'
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"

const queryclient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryclient}>
    <AuthContext>
    <App/>
    </AuthContext>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

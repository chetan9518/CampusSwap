import { useEffect, useState } from 'react'
import './App.css'
import DesktopRoute from './routes/desktoproutes'
import MobileRoutes from './routes/mobileroutes'

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    }
    
    checkMobile();
    
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    }
  }, [])

  return isMobile ? <MobileRoutes/> : <DesktopRoute/>
}

export default App

import { Route, Routes } from "react-router-dom";
import MobileAppLayout from "../layout/mobile/mobilemain";
import Listing from "../pages/listings";
import MobileFocusLayout from "../layout/mobile/mobilefocus";
import Item from "../pages/item";
import Profile from "../pages/profile";
import Homepage from "../pages/home";
import Inbox from "../pages/inbox";
import Chat from "../pages/chat";
import Onboarding from "../pages/onboarding";
import ProtectedRoute from "./protectedRoute";
import Auths from "../pages/auth";
import { JWTAuthContext } from "../context/jwtAuthContext";
import SellPage from "../pages/sell";

function MobileRoutes() {
  return (
    <JWTAuthContext>
      <Routes>
        <Route path="/" element={<Auths/>} />
        <Route path="/onBoarding" element={<Onboarding />} />
        
        <Route element={<MobileAppLayout />}>
          <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/listing" element={<ProtectedRoute><Listing /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
        </Route>

        <Route element={<MobileFocusLayout />}>
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><Item /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </JWTAuthContext>
  )
}

export default MobileRoutes;

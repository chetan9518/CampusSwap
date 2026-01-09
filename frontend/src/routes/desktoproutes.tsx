import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/desktop/main";
import Listing from "../pages/listings";
import FocusLayout from "../layout/desktop/focus";
import Item from "../pages/item";
import Profile from "../pages/profile";
import Homepage from "../pages/home";
import Onboarding from "../pages/onboarding";
import ProtectedRoute from "./protectedRoute";
import SellPage from "../pages/sell";
import Auths from "../pages/auth";
import { JWTAuthContext } from "../context/jwtAuthContext";
import Inbox from "../pages/inbox";
import Chat from "../pages/chat";

function DesktopRoute() {
  return (
    <JWTAuthContext>
      <Routes>
        <Route path="/" element={<Auths/>} />
        <Route path="/onBoarding" element={<Onboarding />} />

        <Route element={<AppLayout />}>
          <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/listing" element={<ProtectedRoute><Listing /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
        </Route>

        <Route element={<FocusLayout />}>
          <Route path="/inbox" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
          <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><Item /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </JWTAuthContext>
  )
}
export default DesktopRoute;
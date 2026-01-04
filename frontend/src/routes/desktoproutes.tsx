import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/desktop/main";
import { Inbox } from "lucide-react";
import Listing from "../pages/listings";
import FocusLayout from "../layout/desktop/focus";
import Item from "../pages/item";
import Profile from "../pages/profile";
import Homepage from "../pages/home";
import Auth from "../pages/auth";
import Onboarding from "../pages/onboarding";
import ProtectedRoute from "./protectedRoute";
import { Sell } from "../pages/SellIItem";

function DesktopRoute() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="onBoard" element={<Onboarding />} />

      <Route element={<AppLayout />}>

      <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path="/listing" element={<ProtectedRoute><Listing /></ProtectedRoute>} />
      <Route path= "/sell" element= {<Sell/>}/>
      </Route>

      <Route element={<FocusLayout />}>
        
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/items/:id" element={<ProtectedRoute><Item /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      </Route>

    </Routes>
  )
}
export default DesktopRoute;
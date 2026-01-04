import { Route, Routes } from "react-router-dom";
import MobileAppLayout from "../layout/mobile/mobilemain";
import Listing from "../pages/listings";
import MobileFocusLayout from "../layout/mobile/mobilefocus";
import Item from "../pages/item";
import Profile from "../pages/profile";
import Homepage from "../pages/home";
import Inbox from "../pages/inbox";
import Auth from "../pages/auth";
import Onboarding from "../pages/onboarding";
import ProtectedRoute from "./protectedRoute";

function MobileRoutes(){
return (
 <Routes>
     <Route path="/" element={<Auth/>} />
     <Route path="onBoard" element={<Onboarding/>}/>
      <Route element={<MobileAppLayout />}>
        
        <Route path="/home" element={
          <ProtectedRoute><Homepage />
          </ProtectedRoute>} />
        <Route path="/listing" element={
          <ProtectedRoute><Listing />
          </ProtectedRoute>} />

      </Route>

      <Route element={<MobileFocusLayout />}>

        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/items/:id" element={<ProtectedRoute><Item /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      </Route>

    </Routes>
)
}
export default MobileRoutes;

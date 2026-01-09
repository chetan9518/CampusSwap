import { Outlet } from "react-router-dom";
import { useState } from "react";
import MobileNavbar from "../../components/appHeaderMobile";
import BottomBar from "../../components/bottomnav";

function MobileAppLayout() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col safe-area-inset">
            
            <div className="fixed top-0 left-0 right-0 z-50 mb-14 bg-white">
                <MobileNavbar />
            </div>
           
            <main className="flex-1 pt-16 pb-14 px-3 md:px-4 overflow-y-auto overscroll-y-contain">
                <Outlet context={{ activeCategory, setActiveCategory }} />
            </main>
            
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
                <BottomBar />
            </div>
        </div>
    )
}
export default MobileAppLayout;
import { Outlet } from "react-router-dom";
import Navbar from "../../components/appHeader";
import SideBar from "../../components/sidebar";

function AppLayout() {
    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <div className="sticky top-0 z-50 w-full h-16 shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 shrink-0 h-full overflow-y-auto shadow-lg">
                    <SideBar />
                </aside>

                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default AppLayout;
import { Outlet } from "react-router-dom";

function MobileFocusLayout(){
    return (
        <div className="min-h-screen w-full bg-slate-50">
        <main>
            <Outlet/>
        </main>
        </div>
    )
}
export default MobileFocusLayout;
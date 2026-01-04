
import { Outlet } from "react-router-dom";

function FocusLayout(){
    return (
        <div className=" flex flex-col min-h-screen w-full  bg-slate-50">
       
        <main>
            <Outlet/>
        </main>
        </div>
    )
}
export default FocusLayout;
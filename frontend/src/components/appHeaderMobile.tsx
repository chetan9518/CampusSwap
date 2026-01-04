import { useNavigate } from "react-router-dom";

function MobileNavbar() {
    const navigate = useNavigate();

    return (
        <div className="h-14 px-3 w-full bg-white border-b border-gray-200 flex items-center justify-between">
            <img
                className="h-9 w-auto cursor-pointer active:opacity-80 transition-opacity"
                src="/logo.png"
                alt="CampusSwap Logo"
                onClick={() => navigate("/")}
            />
            <img
                className="h-9 w-9 rounded-full object-cover cursor-pointer active:opacity-80 transition-opacity border border-gray-200"
                src="/it.jpg"
                alt="Profile"
                onClick={() => navigate("/profile")}
            />
        </div>
    )
}
export default MobileNavbar;
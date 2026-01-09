import { Search, Home, Inbox, User, Grid3x3, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";

function Navbar(){
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useJWTAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="h-16 px-10 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-x-6">
                <img 
                    className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
                    src="/logo.png"
                    alt="CampusSwap Logo"
                    onClick={() => navigate("/")}
                />
                <div className="relative">
                    <input 
                        className="w-80 px-4 pr-10 h-10 shadow-sm border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        placeholder="Search items in your campus.."
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            
            <div className="flex items-center gap-x-4">
                <button 
                    onClick={() => navigate("/")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive("/") 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    <Home className="w-4 h-4" />
                    Home
                </button>
                
                <button 
                    onClick={() => navigate("/listing")}
                    className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Sell
                </button>
                
                <button 
                    onClick={() => navigate("/inbox")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive("/inbox") 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    <Inbox className="w-4 h-4" />
                    Inbox
                </button>
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive("/profile") 
                                ? "text-blue-600 bg-blue-50" 
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </button>
                    
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg py-1 min-w-[180px] z-50">
                            <button 
                                onClick={() => {
                                    navigate("/profile");
                                    setShowDropdown(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </button>
                            <button 
                                onClick={() => {
                                    navigate("/listing");
                                    setShowDropdown(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Grid3x3 className="w-4 h-4" />
                                <span>My Listings</span>
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Navbar;

import { Home, List, Plus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: "/", icon: Home, label: "Home" },
        { path: "/listing", icon: Plus, label: "Sell" },
        { path: "/listing", icon: List, label: "My Listings" },
        { path: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="fixed bottom-0 bg-white left-0 right-0 border-t border-gray-200 h-14">
            <div className="grid grid-cols-4 h-full">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                                active 
                                    ? "text-blue-600" 
                                    : "text-gray-500 active:text-gray-700"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
export default BottomBar;
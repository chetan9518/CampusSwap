import { useNavigate, useLocation } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";
import { Inbox, Search, User } from "lucide-react";

function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useJWTAuth();

  const isOnHome = location.pathname === "/home";

  const goToHome = () => {
    if (!isOnHome) navigate("/home");
  };

  const handleSearchClick = () => {
    if (!isOnHome) {
      navigate("/home");
      setTimeout(() => {
        const el = document.getElementById("mobile-search-input");
        if (el && "focus" in el) {
          (el as HTMLInputElement).focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    } else {
      const el = document.getElementById("mobile-search-input");
      if (el && "focus" in el) {
        (el as HTMLInputElement).focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        {/* Logo / Brand (matches desktop branding) */}
        <button
          type="button"
          onClick={goToHome}
          className="flex items-center gap-2 active:opacity-80"
        >
          <img
            src="/logo.png"
            alt="CampusSwap Logo"
            className="h-8 w-auto rounded-md"
          />
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search shortcut (focuses search field on home) */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="p-2 rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
            aria-label="Search items"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Inbox / messages */}
          <button
            type="button"
            onClick={() => navigate("/inbox")}
            className="relative p-2 rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
            aria-label="Inbox"
          >
            <Inbox className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </button>

          {/* Profile avatar */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 border border-gray-200"
            aria-label="Profile"
          >
            {user?.fullName ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default MobileNavbar;



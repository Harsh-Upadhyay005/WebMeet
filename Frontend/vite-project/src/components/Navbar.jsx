import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Video, UserIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const handleLogout = async () => {
    try {
      // Call logout API to clear server cookie
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.log("Logout API error (ignored):", error);
    } finally {
      // Always clear local storage and redirect regardless of API result
      localStorage.removeItem('authToken');
      // Force full page redirect
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <Video className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  WebMeet
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 mt-2">
              <li className="menu-title">
                <span className="text-sm font-semibold">{authUser?.fullName}</span>
                <span className="text-xs opacity-60">{authUser?.email}</span>
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Edit Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
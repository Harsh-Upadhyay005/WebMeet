import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { UsersIcon, Video, HomeIcon, BellIcon, Users } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import LazyImage from "./LazyImage";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-base-300">
          <Link to="/" className="flex items-center gap-2.5">
            <Video className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              WebMeet
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>

          <Link
            to="/groups"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/groups" || currentPath.startsWith("/group-") ? "btn-active" : ""
            }`}
          >
            <Users className="size-5 text-base-content opacity-70" />
            <span>Groups</span>
          </Link>

          <Link
            to="/notifications"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/notifications" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            <span>Notifications</span>
          </Link>
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <LazyImage src={authUser?.profilePic} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPath === "/" ? "text-primary" : "text-base-content opacity-70"
            }`}
          >
            <HomeIcon className="size-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/groups"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPath === "/groups" || currentPath.startsWith("/group-") ? "text-primary" : "text-base-content opacity-70"
            }`}
          >
            <Users className="size-5" />
            <span className="text-xs mt-1">Groups</span>
          </Link>
          <Link
            to="/notifications"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPath === "/notifications" ? "text-primary" : "text-base-content opacity-70"
            }`}
          >
            <BellIcon className="size-5" />
            <span className="text-xs mt-1">Alerts</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <div className="avatar">
              <div className="w-7 rounded-full">
                <LazyImage src={authUser?.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
export default Sidebar;
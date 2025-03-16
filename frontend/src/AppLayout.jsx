import { Outlet } from "react-router";
import Navbar from "./ui/Navbar";
import SideBar from "./ui/SideBar";
import Main from "./ui/Main";
import { useState } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Мобильное меню */}
        <div
          className={`bg-opacity-50 fixed inset-0 z-40 transition-opacity lg:hidden ${
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 transform bg-gray-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideBar onClose={() => setIsSidebarOpen(false)} />
        </div>
        <Main>
          <Outlet />
        </Main>
      </div>
    </div>
  );
}

export default AppLayout;

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

function MainLayout({ children }) {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <div className="flex min-h-screen bg-white dark:bg-zinc-950 transition-all">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1
          transition-all
          duration-300
          overflow-x-hidden
          relative
        `}
      >

        {/* Glow Background */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full"></div>

        <div className="pointer-events-none absolute top-[300px] right-0 w-[400px] h-[400px] bg-purple-400/10 blur-[120px] rounded-full"></div>

        {/* Page */}
        <div className="relative z-10 p-6 lg:p-10">

          {children}

        </div>

      </main>

    </div>
  );
}

export default MainLayout;
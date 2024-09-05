import type { FC, PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const NavbarSidebarLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <main className="relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </>
  );
};

export default NavbarSidebarLayout;

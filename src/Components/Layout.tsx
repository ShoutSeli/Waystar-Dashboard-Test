import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string; // pass the current page title here
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Eligibility Check", path: "/eligibility" },
    { name: "Claim Submission", path: "/submission" },
    { name: "Billing Details", path: "/billing" },
    { name: "Claim Status Monitor", path: "/status" },
    { name: "Rejection Review", path: "/rejections" },
    { name: "Insurance/Payer View", path: "/insurancepayerview" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 z-50 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Current Page Title */}
          <h1 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
            {currentPage}
          </h1>

          {/* Menu Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-md">
            <ul className="flex flex-col space-y-2 p-4 text-gray-700 dark:text-gray-200 font-medium">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-grow pt-24 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          © {new Date().getFullYear()} Hospital Claims Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

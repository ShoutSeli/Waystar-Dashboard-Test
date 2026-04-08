import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import logo from "../assets/Images/icon_waystar.jpg";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Eligibility Check", path: "/eligibility", icon: ShieldCheckIcon },
    { name: "Claim Submission", path: "/submission", icon: ClipboardDocumentListIcon },
    { name: "Billing Details", path: "/billing", icon: CurrencyDollarIcon },
    { name: "Claim Status Monitor", path: "/status", icon: ChartBarIcon },
    { name: "Rejection Review", path: "/rejections", icon: BellAlertIcon },
    { name: "Insurance/Payer View", path: "/insurancepayerview", icon: UserGroupIcon },
    { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg w-64 z-40`}
      >
        <div className="p-4 flex items-center space-x-2 translate-x-5 translate-y-3 dark:border-gray-700">
          <img src={logo} alt="logo" className="block w-5 h-5 rounded"/>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            WAYSTAR
          </span>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md ${
                    currentPage === item.name ? "bg-blue-100 dark:bg-gray-700 font-semibold" : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3 md:px-6">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            {currentPage}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Admin</span>
            <img
              src="https://via.placeholder.com/32"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Business Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

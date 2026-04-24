import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import NotificationBell from "./NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard",            path: "/",                  icon: HomeIcon },
    { name: "Eligibility Check",    path: "/eligibility",       icon: ShieldCheckIcon },
    { name: "Claim Submission",     path: "/submission",        icon: ClipboardDocumentListIcon },
    { name: "Billing Details",      path: "/billing",           icon: CurrencyDollarIcon },
    { name: "Claim Status Monitor", path: "/status",            icon: ChartBarIcon },
    { name: "Rejection Review",     path: "/rejections",        icon: BellAlertIcon },
    { name: "Insurance/Payer View", path: "/insurancepayerview",icon: UserGroupIcon },
    { name: "Settings",             path: "/settings",          icon: Cog6ToothIcon },
  ];

  return (
    <div key={location.pathname} className="flex min-h-screen font-nohemi bg-gray-100 dark:bg-gray-900">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
  className={`fixed md:fixed top-0 left-0 h-screen flex z-40 transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  }`}>
        {/* Slim accent strip */}
        <div className="w-10 bg-gradient-to-b from-color-3 to-color-4 dark:bg-gray-700 flex flex-col items-center py-4 space-y-6" />

        {/* Primary sidebar */}
        <div className="w-68 bg-color-5 dark:bg-gray-800 shadow-lg flex flex-col">
          <div className="flex items-center justify-center h-16 px-4 mt-4">
            <div className="-translate-x-18">
              <svg className="w-27 h-10 fill-current text-primary -translate-x-2">
                <use href="/src/assets/icons/icons.svg#oght-icon" />
              </svg>
            </div>
            <div className="flex -translate-x-20">
              <img src="src/assets/Images/icon_waystar.jpg" alt="Waystar Logo" className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold text-gray-700 dark:text-blue-400">Waystar</h1>
            </div>
          </div>

          <nav className="ml-4 mt-6 flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition ${
                      currentPage === item.name ? "dark:bg-gray-700 font-semibold ml-10" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-gray-700 dark:text-blue-400" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 md:ml-72">

        {/* Header */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-6 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-200 flex-1 truncate ml-10">
            {currentPage}
          </h2>

          {/* Right side: bell + avatar */}
          <div className="flex items-center gap-3">
            {/* ── Notification Bell ── */}
            <NotificationBell />

            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">Admin</span>
            <img
              src="https://via.placeholder.com/32"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 mt-auto">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Business Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
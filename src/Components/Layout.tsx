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
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import NotificationBell from "./NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const mountIdRef = React.useRef(Math.random());

  React.useEffect(() => {
    console.log("[Layout] mounted id:", mountIdRef.current);
  }, []);

  React.useEffect(() => {
    console.log(
      "[Layout] route:",
      location.pathname,
      "sidebarCollapsed:",
      sidebarCollapsed,
      "sidebarOpen:",
      sidebarOpen
    );
  }, [location.pathname, sidebarCollapsed, sidebarOpen]);





  const navItems = [
    { name: "Dashboard",            path: "/",                    icon: HomeIcon },
    { name: "Eligibility Check",    path: "/eligibility",         icon: ShieldCheckIcon },
    { name: "Claim Submission",     path: "/submission",          icon: ClipboardDocumentListIcon },
    { name: "Billing Details",      path: "/billing",             icon: CurrencyDollarIcon },
    { name: "Claims Monitor",       path: "/status",              icon: ChartBarIcon },
    { name: "Rejection Review",     path: "/rejections",          icon: BellAlertIcon },
    { name: "Payer View",           path: "/insurancepayerview",  icon: UserGroupIcon },
    { name: "Settings",             path: "/settings",            icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-nohemi bg-slate-50 dark:bg-slate-900">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden sm:hidden"
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
        <div className="w-1 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex flex-col items-center" />

        {/* Primary sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"} bg-slate-50 dark:bg-slate-800 shadow-base flex flex-col border-r border-slate-200 dark:border-slate-700`}>
          <div className="flex items-center justify-center h-20 px-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              {!sidebarCollapsed && (
                <img src="/Images/MedSov.jpeg" alt="medsov Logo" className="h-6 w-30 -translate-x-10" />
              )}
            </div>
          </div>
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2 translate-x-8"} mt-6`}>
              {!sidebarCollapsed && (
                <>
                  <img src="/Images/icon_waystar.jpg" alt="Waystar Logo" className="h-6 w-6" />
                  <h1 className="text-lg font-medium text-slate-800 dark:text-slate-100">Waystar</h1>
                </>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`${sidebarCollapsed ? "ml-0" : "ml-15"} p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors`}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5 text-slate-800 dark:text-slate-300" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5 text-slate-800 dark:text-slate-300" />
                )}
              </button>
            </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto sidebar-nav">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-4"} py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-red-500 dark:bg-red-700 text-white dark:text-white shadow-sm font-bold"
                          : "text-base font-medium text-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-base font-medium text-slate-800 ml-3">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>

        {/* Header */}
        <header className="flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <h2 className="text-base font-medium text-slate-800 dark:text-slate-100 flex-1 truncate ml-4 md:ml-0">
            {currentPage}
          </h2>

          {/* Right side: bell + avatar */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-400 hidden sm:inline">Admin</span>
            <img
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/avatar-icon-svg-download-png-2010300.png?f=webp&w=128"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 shadow-sm py-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-slate-500 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()} Waystar Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
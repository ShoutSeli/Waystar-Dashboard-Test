import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import Layout from "./Layout";

const Settings = () => {
  const { theme, setTheme, language, setLanguage } = useSettings();
  const [activeTab, setActiveTab] = useState<"preferences" | "notifications">("preferences");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <Layout currentPage="Settings">
      <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Settings
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "preferences"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Preferences
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "notifications"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Notifications
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="flex-1 space-y-6 overflow-y-auto">
          {activeTab === "preferences" && (
            <>
              {/* Theme Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 space-y-5">
  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
    Theme
  </h2>
  <div className="flex gap-3">
    {/* Light Theme Button */}
    <button
      onClick={() => setTheme("light")}
      className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
        theme === "light"
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/30"
          : "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-gray-600/50 hover:border-blue-400/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-lg hover:shadow-xl"
      }`}
    >
      {/* Active indicator */}
      {theme === "light" && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse" />
      )}
      
      {/* Icon */}
      <div className="relative flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
          theme === "light"
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg"
            : "bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-md"
        }`} />
        <span>Light</span>
      </div>
    </button>

    {/* Dark Theme Button */}
    <button
      onClick={() => setTheme("dark")}
      className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-2xl shadow-gray-900/50 ring-2 ring-gray-300/30"
          : "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-gray-600/50 hover:border-purple-400/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-lg hover:shadow-xl"
      }`}
    >
      {/* Active indicator */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl blur opacity-75 animate-pulse" />
      )}
      
      {/* Icon */}
      <div className="relative flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-400 to-gray-600 shadow-lg"
            : "bg-gradient-to-r from-gray-500 to-gray-700 shadow-md"
        }`} />
        <span>Dark</span>
      </div>
    </button>
  </div>
</div>

              {/* Language Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Language
                </h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Extra Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Extra Preferences
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Enable Auto‑Save</span>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Compact Layout</span>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              {/* Notifications Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Notifications
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Enable Alerts</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={() => setEmailAlerts(!emailAlerts)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full ${
                        emailAlerts ? "bg-blue-600" : "bg-gray-400"
                      } relative transition`}
                    >
                      <div
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${
                          emailAlerts ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Extra Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  More Notification Settings
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Email Alerts</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">SMS Alerts</span>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={() => setSmsAlerts(!smsAlerts)}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Settings;

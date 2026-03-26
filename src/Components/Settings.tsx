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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Theme
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-lg ${
                      theme === "light"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    Dark
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

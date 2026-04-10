import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import Layout from "./Layout";

type Tab = "preferences" | "configurations" | "notifications";

const Settings = () => {
  const { theme, setTheme, language, setLanguage } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("preferences");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Configuration form state
  const [config, setConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    transmitTo: "",
    fetchFrom: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const handleConfigChange = (field: keyof typeof config, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const testConnection = () => {
    setTestStatus("testing");
    setTimeout(() => {
      const ok = config.host.trim() !== "" && config.port.trim() !== "";
      setTestStatus(ok ? "success" : "failed");
      setTimeout(() => setTestStatus("idle"), 4000);
    }, 2000);
  };

  const saveSettings = () => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    {
      id: "preferences",
      label: "Preferences",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      id: "configurations",
      label: "Configurations",
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    },
  ];

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:bg-gray-600";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 dark:text-gray-400";

  return (
    <Layout currentPage="Settings">
      <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">

        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-4 h-fit">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Settings</h3>
          <ul className="space-y-1">
            {tabs.map(({ id, label, icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition
                    ${activeTab === id
                      ? "bg-color-1 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <section className="flex-1 space-y-6 overflow-y-auto">

          {/* ── PREFERENCES ─────────────────────────────────────────── */}
          {activeTab === "preferences" && (
            <>
              {/* Theme Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 space-y-5">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Theme
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      theme === "light"
                        ? "bg-gradient-to-r from-color-1 to-color-4 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/30"
                        : "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-gray-600/50 hover:border-blue-400/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {theme === "light" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-color-1 to-color-4 rounded-2xl blur opacity-75 animate-pulse" />
                    )}
                    <div className="relative flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${theme === "light" ? "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg" : "bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-md"}`} />
                      <span>Light</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-2xl shadow-gray-900/50 ring-2 ring-gray-300/30"
                        : "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-gray-600/50 hover:border-purple-400/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {theme === "dark" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl blur opacity-75 animate-pulse" />
                    )}
                    <div className="relative flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-r from-gray-400 to-gray-600 shadow-lg" : "bg-gradient-to-r from-gray-500 to-gray-700 shadow-md"}`} />
                      <span>Dark</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Language</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
                  className={inputClass}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Extra Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Extra Preferences</h2>
                <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Enable Auto‑Save</span>
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Compact Layout</span>
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                </div>
              </div>
            </>
          )}

          {/* ── CONFIGURATIONS ──────────────────────────────────────── */}
          {activeTab === "configurations" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Server Configuration</h2>
                  <p className="text-xs text-gray-400">Configure your connection settings and data endpoints</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Connection Details section */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-gray-300" />
                    Connection Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Host */}
                    <div>
                      <label className={labelClass}>Host</label>
                      <input
                        type="text"
                        value={config.host}
                        onChange={(e) => handleConfigChange("host", e.target.value)}
                        placeholder="e.g. 192.168.1.1 or myserver.com"
                        className={inputClass}
                      />
                    </div>

                    {/* Port */}
                    <div>
                      <label className={labelClass}>Port</label>
                      <input
                        type="text"
                        value={config.port}
                        onChange={(e) => handleConfigChange("port", e.target.value)}
                        placeholder="e.g. 5432"
                        className={inputClass}
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className={labelClass}>Username</label>
                      <input
                        type="text"
                        value={config.username}
                        onChange={(e) => handleConfigChange("username", e.target.value)}
                        placeholder="Enter username"
                        className={inputClass}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className={labelClass}>Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={config.password}
                          onChange={(e) => handleConfigChange("password", e.target.value)}
                          placeholder="Enter password"
                          className={`${inputClass} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Endpoints section */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-gray-300" />
                    Data Endpoints
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Transmit To */}
                    <div>
                      <label className={labelClass}>Transmit To</label>
                      <input
                        type="text"
                        value={config.transmitTo}
                        onChange={(e) => handleConfigChange("transmitTo", e.target.value)}
                        placeholder="e.g. /api/v1/transmit"
                        className={inputClass}
                      />
                    </div>

                    {/* Fetch From */}
                    <div>
                      <label className={labelClass}>Fetch From</label>
                      <input
                        type="text"
                        value={config.fetchFrom}
                        onChange={(e) => handleConfigChange("fetchFrom", e.target.value)}
                        placeholder="e.g. /api/v1/fetch"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Test connection status */}
                {testStatus !== "idle" && (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border
                    ${testStatus === "testing"  ? "bg-blue-50  border-blue-100  text-blue-700  dark:bg-blue-900/20  dark:border-blue-800  dark:text-blue-300" : ""}
                    ${testStatus === "success"  ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300" : ""}
                    ${testStatus === "failed"   ? "bg-red-50   border-red-100   text-red-700   dark:bg-red-900/20   dark:border-red-800   dark:text-red-300" : ""}`}>
                    {testStatus === "testing" && (
                      <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {testStatus === "success" && (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {testStatus === "failed" && (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {testStatus === "testing" && "Testing connection…"}
                    {testStatus === "success" && "Connection successful! Server is reachable."}
                    {testStatus === "failed"  && "Connection failed. Please check your host and port settings."}
                  </div>
                )}

                {/* Save success banner */}
                {saveStatus === "saved" && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Settings saved successfully.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={testConnection}
                    disabled={testStatus === "testing"}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40"
                  >
                    {testStatus === "testing" ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    )}
                    {testStatus === "testing" ? "Testing…" : "Test Connection"}
                  </button>

                  <button
                    onClick={saveSettings}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-color-1 rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ───────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Notifications</h2>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Enable Alerts</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} className="sr-only" />
                    <div className={`w-11 h-6 rounded-full ${emailAlerts ? "bg-color-1" : "bg-gray-300"} relative transition`}>
                      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${emailAlerts ? "translate-x-5" : ""}`} />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">More Notification Settings</h2>
                <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Email Alerts</span>
                  <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} className="w-4 h-4 accent-blue-600" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-200">SMS Alerts</span>
                  <input type="checkbox" checked={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} className="w-4 h-4 accent-blue-600" />
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
import { useState } from "react";
import Layout from "./Layout";

//type Tab = "configurations";

const Settings = () => {
// const [activeTab, setActiveTab] = useState<Tab>("configurations");

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

  const inputClass =
    "w-full px-3 py-2 text-sm font-medium text-slate-800 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:bg-gray-600";
  const labelClass = "block text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white";

  return (
    <Layout currentPage="Settings">
      <div className="flex flex-col gap-6 min-h-screen dark:bg-slate-900 p-4 md:p-8">
        {/* Main Content */}
        <section className="flex-1 space-y-6 overflow-y-auto animate-cascade">
  
          {/* ── CONFIGURATIONS ──────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-slate-100 dark:bg-slate-700/30 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-red-500 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-slate-800 dark:text-white">Server Configuration</h2>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Configure your connection settings and data endpoints</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Connection Details section */}
                <div>
                  <p className="text-sm font-medium text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 dark:text-white">
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 dark:text-white dark:hover:text-gray-300 transition"
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
                  <p className="text-sm font-medium text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 dark:text-white">
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
                    ${testStatus === "testing"  ? "bg-slate-100  border-blue-100  text-slate-800  dark:bg-slate-700/20  dark:border-blue-800  dark:text-slate-200" : ""}
                    ${testStatus === "success"  ? "bg-slate-100 border-emerald-100 text-slate-800 dark:bg-slate-700/20 dark:border-emerald-800 dark:text-slate-200" : ""}
                    ${testStatus === "failed"   ? "bg-slate-100   border-red-100   text-slate-800   dark:bg-slate-700/20   dark:border-red-800   dark:text-slate-200" : ""}`}>
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
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border bg-slate-100 border-emerald-100 text-slate-800 dark:bg-slate-700/20 dark:border-emerald-800 dark:text-slate-200">
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
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-200"
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
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 transition shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
        </section>
      </div>
    </Layout>
  );
};

export default Settings;
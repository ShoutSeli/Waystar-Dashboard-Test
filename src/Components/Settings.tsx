import React, { useState } from "react";
import Layout from "./Layout";
import { useThemeLanguage } from "../ThemeLanguageContext";

const Settings: React.FC = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useThemeLanguage();
  const [notifications, setNotifications] = useState(true);
  const [timezone, setTimezone] = useState("GMT");
  const [name, setName] = useState("Samuel");
  const [email, setEmail] = useState("samuel@example.com");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <Layout currentPage="Settings">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Profile Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Profile</h3>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No Avatar
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="text-sm"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                placeholder="Email Address"
              />
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {darkMode ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable system alerts</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full ${
                notifications ? "bg-blue-600" : "bg-gray-400"
              } relative transition`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${
                  notifications ? "translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* Language Selector */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Language</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 w-full sm:w-1/2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
          </select>
        </div>

        {/* Timezone Selector */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Timezone</h3>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-2 w-full sm:w-1/2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
          >
            <option>GMT</option>
            <option>UTC</option>
            <option>EST</option>
            <option>PST</option>
          </select>
        </div>

        {/* Account Management */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Account</h3>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Change Password
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

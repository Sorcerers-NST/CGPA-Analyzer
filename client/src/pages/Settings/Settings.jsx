import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiBell, FiLock, FiTrash2, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    twoFactor: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your application preferences and account settings</p>
        </div>

        <Section title="Appearance" icon={<FiSun className="w-5 h-5" />}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Theme</h3>
              <p className="text-xs text-gray-500 mt-1">Select your preferred interface theme</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  settings.theme === 'light'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiSun className="w-4 h-4" /> Light
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FiMoon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>
        </Section>

        <Section title="Notifications" icon={<FiBell className="w-5 h-5" />}>
          <Toggle
            label="Email Notifications"
            description="Receive updates and alerts via email"
            checked={settings.emailNotifications}
            onChange={() => toggleSetting('emailNotifications')}
          />
          <div className="border-t border-gray-100" />
          <Toggle
            label="Push Notifications"
            description="Receive real-time notifications on your device"
            checked={settings.pushNotifications}
            onChange={() => toggleSetting('pushNotifications')}
          />
        </Section>

        <Section title="Privacy & Security" icon={<FiShield className="w-5 h-5" />}>
          <Toggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactor}
            onChange={() => toggleSetting('twoFactor')}
          />
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-500 mt-1">Update your account password</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Update
            </button>
          </div>
        </Section>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <FiTrash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700 mt-1">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;

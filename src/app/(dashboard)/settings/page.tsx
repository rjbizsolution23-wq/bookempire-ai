'use client'

import { useState } from 'react'
import { User, Bell, Key, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    generationComplete: true,
    weeklyReport: false,
    marketingEmails: false,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-cyan-600" />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                defaultValue="Rick"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                defaultValue="Jefferson"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue="rick@rjbizsolutions.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Pen Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Your author name for books"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-cyan-600" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ ...settings, emailNotifications: e.target.checked })
              }
              className="h-5 w-5 text-cyan-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Generation Complete</p>
              <p className="text-sm text-gray-600">
                Notify when book generation is complete
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.generationComplete}
              onChange={(e) =>
                setSettings({ ...settings, generationComplete: e.target.checked })
              }
              className="h-5 w-5 text-cyan-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Weekly Report</p>
              <p className="text-sm text-gray-600">Receive weekly activity summary</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReport}
              onChange={(e) =>
                setSettings({ ...settings, weeklyReport: e.target.checked })
              }
              className="h-5 w-5 text-cyan-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-600">Receive tips and product updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={(e) =>
                setSettings({ ...settings, marketingEmails: e.target.checked })
              }
              className="h-5 w-5 text-cyan-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-cyan-600" />
          API Access
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Use the API to integrate BookEmpire AI with your applications
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm mb-4">
          bke_xxxxxxxxxxxxxxxxxxxxxxxx
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
          Generate New API Key
        </button>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-cyan-600" />
          Security
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-900">Change Password</span>
            <span className="text-sm text-gray-600">→</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-900">Two-Factor Authentication</span>
            <span className="text-sm text-green-600">Enabled</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <span className="font-medium text-gray-900">Active Sessions</span>
            <span className="text-sm text-gray-600">2 devices</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          These actions are permanent and cannot be undone
        </p>
        <div className="space-y-3">
          <button className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium">
            Delete All Books
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium ml-3">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

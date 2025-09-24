'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Camera,
  Save,
  Settings,
  Shield,
  Bell,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Globe,
  Lock
} from 'lucide-react'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1995-06-15',
    address: '123 Main Street, City, State 12345',
    emergencyContact: '+1 234 567 8901',
    previousEducation: 'Bachelor of Arts in English Literature',
    targetScore: '79',
    preferredStudyTime: 'Evening',
    bio: 'Aspiring to achieve my dream score in PTE and pursue higher education abroad.',
    profilePicture: '/placeholder-avatar.jpg'
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    darkMode: false,
    language: 'english',
    twoFactorAuth: false,
    dataSharing: true,
    marketingEmails: false
  })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<string>('')

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile')
    const savedSettings = localStorage.getItem('studentSettings')

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const saved = localStorage.getItem('lastProfileSave')
    if (saved) {
      setLastSaved(saved)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const handleSave = async () => {
    setSaveStatus('saving')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Save to localStorage
      localStorage.setItem('studentProfile', JSON.stringify(profileData))
      localStorage.setItem('studentSettings', JSON.stringify(settings))

      const now = new Date().toLocaleString()
      localStorage.setItem('lastProfileSave', now)
      setLastSaved(now)

      setSaveStatus('success')

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = [
    {
      title: "Profile Completion",
      value: "95%",
      description: "Almost complete!",
      icon: User,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Account Status",
      value: "Active",
      description: "Verified student",
      icon: Shield,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Member Since",
      value: "2024",
      description: "Joined this year",
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Target Score",
      value: profileData.targetScore,
      description: "PTE Academic goal",
      icon: GraduationCap,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const quickSettingsActions = [
    {
      title: "Email Notifications",
      description: settings.emailNotifications ? "Enabled" : "Disabled",
      icon: settings.emailNotifications ? Mail : VolumeX,
      isActive: settings.emailNotifications,
      onClick: () => handleSettingChange('emailNotifications', !settings.emailNotifications),
      color: settings.emailNotifications ? "bg-green-50 hover:bg-green-100 border-green-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
    },
    {
      title: "Push Notifications",
      description: settings.pushNotifications ? "Enabled" : "Disabled",
      icon: settings.pushNotifications ? Bell : VolumeX,
      isActive: settings.pushNotifications,
      onClick: () => handleSettingChange('pushNotifications', !settings.pushNotifications),
      color: settings.pushNotifications ? "bg-blue-50 hover:bg-blue-100 border-blue-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
    },
    {
      title: "Profile Visibility",
      description: settings.profileVisibility === 'public' ? "Public" : "Private",
      icon: settings.profileVisibility === 'public' ? Eye : EyeOff,
      isActive: settings.profileVisibility === 'public',
      onClick: () => handleSettingChange('profileVisibility', settings.profileVisibility === 'public' ? 'private' : 'public'),
      color: settings.profileVisibility === 'public' ? "bg-purple-50 hover:bg-purple-100 border-purple-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
    },
    {
      title: "Dark Mode",
      description: settings.darkMode ? "Enabled" : "Disabled",
      icon: settings.darkMode ? Moon : Sun,
      isActive: settings.darkMode,
      onClick: () => handleSettingChange('darkMode', !settings.darkMode),
      color: settings.darkMode ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200" : "bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
    },
    {
      title: "Two-Factor Auth",
      description: settings.twoFactorAuth ? "Enabled" : "Disabled",
      icon: settings.twoFactorAuth ? Shield : Lock,
      isActive: settings.twoFactorAuth,
      onClick: () => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth),
      color: settings.twoFactorAuth ? "bg-green-50 hover:bg-green-100 border-green-200" : "bg-red-50 hover:bg-red-100 border-red-200"
    },
    {
      title: "Marketing Emails",
      description: settings.marketingEmails ? "Subscribed" : "Unsubscribed",
      icon: settings.marketingEmails ? Mail : VolumeX,
      isActive: settings.marketingEmails,
      onClick: () => handleSettingChange('marketingEmails', !settings.marketingEmails),
      color: settings.marketingEmails ? "bg-orange-50 hover:bg-orange-100 border-orange-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your personal information and account settings
          </p>
          {lastSaved && (
            <p className="text-sm text-gray-500">
              Last saved: {lastSaved}
            </p>
          )}
        </div>

        {/* Save Status Banner */}
        {saveStatus !== 'idle' && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 ${
            saveStatus === 'saving' ? 'bg-blue-50 border border-blue-200' :
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            {saveStatus === 'saving' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
            {saveStatus === 'success' && <Check className="h-5 w-5 text-green-600" />}
            {saveStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className={`font-medium ${
              saveStatus === 'saving' ? 'text-blue-800' :
              saveStatus === 'success' ? 'text-green-800' :
              'text-red-800'
            }`}>
              {saveStatus === 'saving' && 'Saving changes...'}
              {saveStatus === 'success' && 'Changes saved successfully!'}
              {saveStatus === 'error' && 'Failed to save changes. Please try again.'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Settings */}
          <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickSettingsActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.onClick}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${action.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <action.icon className={`h-5 w-5 ${action.isActive ? 'text-gray-700' : 'text-gray-500'}`} />
                      <div>
                        <h3 className={`font-medium ${action.isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                          {action.title}
                        </h3>
                        <p className={`text-sm ${action.isActive ? 'text-gray-600' : 'text-gray-500'}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${
                      action.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        action.isActive ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">Personal Information</CardTitle>
                <Button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      {profileData.profilePicture && profileData.profilePicture !== '/placeholder-avatar.jpg' ? (
                        <img src={profileData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xl font-semibold text-white">
                          {profileData.firstName[0]}{profileData.lastName[0]}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input
                      id="emergencyContact"
                      type="tel"
                      value={profileData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                    <input
                      id="address"
                      type="text"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="previousEducation" className="text-sm font-medium text-gray-700">Previous Education</label>
                    <input
                      id="previousEducation"
                      type="text"
                      value={profileData.previousEducation}
                      onChange={(e) => handleInputChange('previousEducation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="targetScore" className="text-sm font-medium text-gray-700">Target PTE Score</label>
                    <select
                      value={profileData.targetScore}
                      onChange={(e) => handleInputChange('targetScore', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select target score</option>
                      <option value="50">50</option>
                      <option value="58">58</option>
                      <option value="65">65</option>
                      <option value="79">79</option>
                      <option value="90">90</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="preferredStudyTime" className="text-sm font-medium text-gray-700">Preferred Study Time</label>
                    <select
                      value={profileData.preferredStudyTime}
                      onChange={(e) => handleInputChange('preferredStudyTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select preferred time</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-vertical"
                      placeholder="Tell us about yourself and your goals..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
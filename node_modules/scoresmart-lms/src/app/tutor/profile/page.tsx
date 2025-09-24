'use client'

import { useState, useEffect } from 'react'
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
  Lock,
  BookOpen,
  Award,
  Users,
  Clock
} from 'lucide-react'

export default function TutorProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@tutormail.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1988-03-22',
    address: '456 Education Street, Teaching City, State 12345',
    emergencyContact: '+1 234 567 8901',
    education: 'Master of Education in TESOL, Bachelor of Arts in English',
    specialization: 'both',
    yearsExperience: '8',
    hourlyRate: '45',
    availableHours: 'Morning, Evening',
    bio: 'Passionate educator with 8+ years of experience helping students achieve their PTE and NAATI goals.',
    profilePicture: '/placeholder-avatar.jpg',
    certifications: 'TESOL Certified, PTE Academic Trainer, NAATI CCL Specialist'
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    darkMode: false,
    language: 'english',
    twoFactorAuth: false,
    dataSharing: true,
    marketingEmails: false,
    studentBookings: true,
    autoScheduling: false
  })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<string>('')

  useEffect(() => {
    const savedProfile = localStorage.getItem('tutorProfile')
    const savedSettings = localStorage.getItem('tutorSettings')

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const saved = localStorage.getItem('lastTutorProfileSave')
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
      await new Promise(resolve => setTimeout(resolve, 1000))

      localStorage.setItem('tutorProfile', JSON.stringify(profileData))
      localStorage.setItem('tutorSettings', JSON.stringify(settings))

      const now = new Date().toLocaleString()
      localStorage.setItem('lastTutorProfileSave', now)
      setLastSaved(now)

      setSaveStatus('success')

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
      value: "98%",
      description: "Almost complete!",
      icon: User,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Tutor Status",
      value: "Active",
      description: "Verified instructor",
      icon: Shield,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Teaching Since",
      value: "2016",
      description: "8+ years experience",
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Specialization",
      value: profileData.specialization === 'both' ? 'PTE & NAATI' : profileData.specialization === 'pte' ? 'PTE Only' : 'NAATI Only',
      description: "Teaching expertise",
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
      title: "Student Bookings",
      description: settings.studentBookings ? "Allow" : "Disabled",
      icon: settings.studentBookings ? Users : VolumeX,
      isActive: settings.studentBookings,
      onClick: () => handleSettingChange('studentBookings', !settings.studentBookings),
      color: settings.studentBookings ? "bg-green-50 hover:bg-green-100 border-green-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
    },
    {
      title: "Auto Scheduling",
      description: settings.autoScheduling ? "Enabled" : "Manual",
      icon: settings.autoScheduling ? Clock : Lock,
      isActive: settings.autoScheduling,
      onClick: () => handleSettingChange('autoScheduling', !settings.autoScheduling),
      color: settings.autoScheduling ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200" : "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Two-Factor Auth",
      description: settings.twoFactorAuth ? "Enabled" : "Disabled",
      icon: settings.twoFactorAuth ? Shield : Lock,
      isActive: settings.twoFactorAuth,
      onClick: () => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth),
      color: settings.twoFactorAuth ? "bg-green-50 hover:bg-green-100 border-green-200" : "bg-red-50 hover:bg-red-100 border-red-200"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Tutor Profile
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage your professional information and teaching preferences
            </p>
          </div>
        </div>

        {lastSaved && (
          <p className="text-sm text-gray-500 text-center">
            Last saved: {lastSaved}
          </p>
        )}

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
          <div className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 p-6">
            <div className="text-center pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Quick Settings</h2>
            </div>
            <div className="space-y-3">
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
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 p-6">
              <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="space-y-6">
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
                    <label htmlFor="specialization" className="text-sm font-medium text-gray-700">Teaching Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pte">PTE Academic Only</option>
                      <option value="naati">NAATI CCL Only</option>
                      <option value="both">Both PTE & NAATI</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="yearsExperience" className="text-sm font-medium text-gray-700">Years of Experience</label>
                    <select
                      value={profileData.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5-8">5-8 Years</option>
                      <option value="8">8+ Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">Hourly Rate (AUD)</label>
                    <input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="20"
                      max="200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="availableHours" className="text-sm font-medium text-gray-700">Available Hours</label>
                    <select
                      value={profileData.availableHours}
                      onChange={(e) => handleInputChange('availableHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Morning">Morning (6AM-12PM)</option>
                      <option value="Afternoon">Afternoon (12PM-6PM)</option>
                      <option value="Evening">Evening (6PM-10PM)</option>
                      <option value="Morning, Afternoon">Morning & Afternoon</option>
                      <option value="Morning, Evening">Morning & Evening</option>
                      <option value="Afternoon, Evening">Afternoon & Evening</option>
                      <option value="All Day">All Day (6AM-10PM)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="education" className="text-sm font-medium text-gray-700">Education & Qualifications</label>
                    <input
                      id="education"
                      type="text"
                      value={profileData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Master of Education, Bachelor of Arts..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="certifications" className="text-sm font-medium text-gray-700">Certifications</label>
                    <input
                      id="certifications"
                      type="text"
                      value={profileData.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., TESOL, CELTA, PTE Academic Trainer..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="text-sm font-medium text-gray-700">Professional Bio</label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-vertical"
                      placeholder="Tell students about your teaching experience, methodology, and achievements..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
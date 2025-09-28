'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Check,
  AlertCircle,
  BookOpen,
  Clock
} from 'lucide-react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    courseType: '',
    emergencyContact: ''
  })
  const [saveStatus, setSaveStatus] = useState('idle')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    console.log('Profile page - loading:', loading)
    console.log('Profile page - user:', user)
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        courseType: user.courseType || '',
        emergencyContact: user.emergencyContact || ''
      })
    }
  }, [user, loading])

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaveStatus('saving')

    try {
      const response = await api.updateProfile(profileData)
      if (response.success) {
        setSaveStatus('success')
        setIsEditing(false)
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const stats = [
    {
      title: "Member Since",
      value: user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear(),
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Course Type",
      value: profileData.courseType || 'Not Set',
      icon: BookOpen,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Account Status",
      value: user?.isActive ? 'Active' : 'Inactive',
      icon: User,
      color: user?.isActive ? "from-green-500 to-green-600" : "from-red-500 to-red-600"
    },
    {
      title: "Last Login",
      value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today',
      icon: Clock,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your personal information
          </p>
        </div>

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
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">Personal Information</CardTitle>
            <div className="space-x-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{profileData.name || 'User'}</h3>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-sm text-gray-500 mt-1">Student ID: {user?.id?.slice(0, 8) || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 234 567 8900"
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="courseType" className="text-sm font-medium text-gray-700 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Type
                </label>
                <select
                  id="courseType"
                  value={profileData.courseType}
                  onChange={(e) => handleInputChange('courseType', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <option value="">Select course type</option>
                  <option value="PTE">PTE Academic</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="GENERAL_ENGLISH">General English</option>
                  <option value="BUSINESS_ENGLISH">Business English</option>
                  <option value="ACADEMIC_WRITING">Academic Writing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contact
                </label>
                <input
                  id="emergencyContact"
                  type="tel"
                  value={profileData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 234 567 8901"
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
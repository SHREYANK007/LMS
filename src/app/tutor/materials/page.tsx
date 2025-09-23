'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MaterialCard from '@/components/materials/MaterialCard'
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  Users,
  Globe,
  Lock,
  FileText,
  Video,
  Download,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Star,
  Calendar
} from 'lucide-react'
import { mockStudyMaterials, materialCategories, getMaterialsByUploader } from '@/data/mock/mockMaterials'
import { StudyMaterial } from '@/types'

export default function TutorMaterialsPage() {
  // Mock current tutor ID (in real app, get from auth context)
  const currentTutorId = '2' // Dr. Sarah Wilson

  const [materials, setMaterials] = useState(mockStudyMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Get materials uploaded by current tutor
  const myMaterials = getMaterialsByUploader(currentTutorId)

  // Filter materials (show all materials + tutor's own materials)
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    const matchesVisibility = selectedVisibility === 'all' || material.visibility === selectedVisibility

    // Show all public materials + tutor's own materials
    const canView = material.visibility === 'all_course_students' || material.uploadedBy === currentTutorId

    return matchesSearch && matchesCategory && matchesVisibility && canView
  })

  // Statistics
  const stats = [
    {
      title: "My Materials",
      value: myMaterials.length.toString(),
      description: "Total uploaded",
      icon: Upload,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Downloads",
      value: "1,247",
      description: "Student downloads",
      icon: Download,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Popular Content",
      value: "8",
      description: "Top rated materials",
      icon: Star,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Recent Uploads",
      value: "3",
      description: "This week",
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    }
  ]

  const quickActions = [
    {
      title: "Upload New Material",
      description: "Add learning resources",
      icon: Upload,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      onClick: () => setShowUploadModal(true)
    },
    {
      title: "Create Study Guide",
      description: "Make structured guides",
      icon: FileText,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      onClick: () => setShowUploadModal(true)
    },
    {
      title: "Record Video",
      description: "Create video lessons",
      icon: Video,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      onClick: () => setShowUploadModal(true)
    },
    {
      title: "Manage Visibility",
      description: "Control access permissions",
      icon: Eye,
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    }
  ]

  const recentMaterials = myMaterials.slice(0, 5)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'video': return Video
      case 'audio': return Video
      default: return BookOpen
    }
  }

  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case 'all_course_students': return { icon: Globe, label: 'Public', color: 'text-green-600' }
      case 'specific_course': return { icon: Users, label: 'Course Only', color: 'text-blue-600' }
      case 'private': return { icon: Lock, label: 'Private', color: 'text-red-600' }
      default: return { icon: Globe, label: 'Public', color: 'text-green-600' }
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Learning Materials
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage and share educational resources with your students
            </p>
          </div>
        </div>

        {/* Stats Grid */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions */}
          <Card className="bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.onClick}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${action.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Materials */}
          <Card className="lg:col-span-2 bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">My Recent Materials</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMaterials.map((material, index) => {
                const TypeIcon = getTypeIcon(material.type)
                const visibilityInfo = getVisibilityInfo(material.visibility)
                const VisibilityIcon = visibilityInfo.icon

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{material.title}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">{material.category}</span>
                          <div className="flex items-center space-x-1">
                            <VisibilityIcon className={`h-3 w-3 ${visibilityInfo.color}`} />
                            <span className={`text-xs ${visibilityInfo.color}`}>{visibilityInfo.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Browse Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {materialCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedVisibility}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Visibility</option>
                  <option value="all_course_students">Public</option>
                  <option value="specific_course">Course Only</option>
                  <option value="private">Private</option>
                </select>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  showActions={material.uploadedBy === currentTutorId}
                />
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Learning Material</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Material Type</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>PDF Document</option>
                  <option>Video Lesson</option>
                  <option>Audio Recording</option>
                  <option>Practice Test</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter material title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>PTE Speaking</option>
                  <option>PTE Writing</option>
                  <option>PTE Reading</option>
                  <option>PTE Listening</option>
                  <option>NAATI CCL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Visibility</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all_course_students">Public (All Students)</option>
                  <option value="specific_course">Course Students Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, MP4, MP3 up to 50MB</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={() => setShowUploadModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setShowUploadModal(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
                Upload Material
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
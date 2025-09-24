'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MaterialCard from '@/components/materials/MaterialCard'
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Upload,
  FileText,
  Video,
  Image,
  BarChart3
} from 'lucide-react'
import { mockStudyMaterials, materialCategories, getMaterialsByCourse } from '@/data/mock/mockMaterials'
import { StudyMaterial } from '@/types'

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState(mockStudyMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedUploader, setSelectedUploader] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCourse = selectedCourse === 'all' || material.courseType === selectedCourse
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    const matchesUploader = selectedUploader === 'all' || material.uploadedByRole === selectedUploader

    return matchesSearch && matchesCourse && matchesCategory && matchesUploader
  })

  // Statistics
  const stats = {
    total: materials.length,
    pte: getMaterialsByCourse('PTE').length,
    naati: getMaterialsByCourse('NAATI').length,
    both: materials.filter(m => m.courseType === 'BOTH').length,
    videos: materials.filter(m => m.fileType.includes('video') || m.fileType === 'mp4').length,
    documents: materials.filter(m => !m.fileType.includes('video') && m.fileType !== 'mp4').length
  }

  const handleViewMaterial = (material: StudyMaterial) => {
    // Implement material viewer
    console.log('Viewing material:', material)
  }

  const handleEditMaterial = (material: StudyMaterial) => {
    // Implement material editor
    console.log('Editing material:', material)
  }

  const handleDeleteMaterial = (material: StudyMaterial) => {
    if (confirm(`Are you sure you want to delete "${material.title}"?`)) {
      setMaterials(prev => prev.filter(m => m.id !== material.id))
    }
  }

  const handleDownloadMaterial = (material: StudyMaterial) => {
    console.log('Downloading material:', material)
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Study Materials
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage course materials, uploads, and student access
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3"
          >
            <Upload className="w-4 h-4" />
            Upload Material
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Materials</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pte}</p>
              <p className="text-xs text-gray-500">PTE Materials</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.naati}</p>
              <p className="text-xs text-gray-500">NAATI Materials</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.both}</p>
              <p className="text-xs text-gray-500">Both Courses</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Video className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              <p className="text-xs text-gray-500">Videos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              <p className="text-xs text-gray-500">Documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>

              {/* Course Filter */}
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-field"
              >
                <option value="all">All Courses</option>
                <option value="PTE">PTE Only</option>
                <option value="NAATI">NAATI Only</option>
                <option value="BOTH">Both Courses</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {materialCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Uploader Filter */}
              <select
                value={selectedUploader}
                onChange={(e) => setSelectedUploader(e.target.value)}
                className="input-field"
              >
                <option value="all">All Uploaders</option>
                <option value="admin">Admin Only</option>
                <option value="tutor">Tutor Only</option>
              </select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCourse('all')
                  setSelectedCategory('all')
                  setSelectedUploader('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onView={handleViewMaterial}
              onEdit={handleEditMaterial}
              onDelete={handleDeleteMaterial}
              onDownload={handleDownloadMaterial}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCourse !== 'all' || selectedCategory !== 'all' || selectedUploader !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Get started by uploading your first study material'
                }
              </p>
              <Button onClick={() => setShowUploadModal(true)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
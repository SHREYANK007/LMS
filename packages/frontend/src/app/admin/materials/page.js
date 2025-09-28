'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import UploadMaterialModal from '@/components/admin/UploadMaterialModal'
import PDFViewer from '@/components/PDFViewer'
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  User,
  FileText,
  Download,
  RefreshCw,
  BarChart3,
  AlertCircle,
  Tag
} from 'lucide-react'

export default function AdminMaterialsPage() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchTerm, categoryFilter])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [materialsResponse, analyticsResponse] = await Promise.all([
        api.getMaterials(),
        api.getMaterialsAnalytics()
      ])

      if (materialsResponse.success) {
        setMaterials(materialsResponse.materials || [])
      }
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.analytics)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load materials')
    } finally {
      setIsLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = materials

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(material => material.courseCategory === categoryFilter)
    }

    setFilteredMaterials(filtered)
  }

  const handleUpload = async (formData) => {
    try {
      const response = await api.uploadMaterial(formData)
      if (response.success) {
        await fetchData()
        alert('Material uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading material:', error)
      throw error
    }
  }

  const handleDelete = async (materialId) => {
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return
    }

    try {
      const response = await api.deleteMaterial(materialId)
      if (response.success) {
        await fetchData()
        alert('Material deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Failed to delete material. Please try again.')
    }
  }

  const handleViewMaterial = (material) => {
    setSelectedMaterial(material)
    setShowPDFViewer(true)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'PTE':
        return 'bg-blue-100 text-blue-800'
      case 'IELTS':
        return 'bg-green-100 text-green-800'
      case 'ALL':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'PTE':
        return '🎯'
      case 'IELTS':
        return '🌐'
      case 'ALL':
        return '📚'
      default:
        return '📄'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Materials Management
            </h1>
            <p className="text-slate-500 text-lg mt-1">Upload and manage study resources</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalMaterials || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Most Popular</p>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {analytics.popularMaterials && analytics.popularMaterials[0]?.title || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.materialsByCategory?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-slate-400" />
            <div className="flex gap-2">
              {['ALL', 'PTE', 'IELTS'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryEmoji(category)} {category === 'ALL' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Materials</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-20">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchTerm || categoryFilter !== 'ALL' ? 'No Materials Found' : 'No Materials Uploaded'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by uploading your first study material.'}
          </p>
          {!searchTerm && categoryFilter === 'ALL' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Upload Material
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(material.courseCategory)}`}>
                    {getCategoryEmoji(material.courseCategory)} {material.courseCategory}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    {material.viewCount}
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>

                {material.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {material.description}
                  </p>
                )}

                {material.tags && Array.isArray(material.tags) && material.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {material.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {material.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{material.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>{material.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-slate-400" />
                    <span>{formatFileSize(material.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                  </div>
                  {material.uploader && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>{material.uploader.name || material.uploader.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewMaterial(material)}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <UploadMaterialModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        userRole={user?.role}
        userCourseType={user?.courseType}
      />

      {showPDFViewer && selectedMaterial && (
        <PDFViewer
          materialId={selectedMaterial.id}
          material={selectedMaterial}
          onClose={() => {
            setShowPDFViewer(false)
            setSelectedMaterial(null)
          }}
        />
      )}
    </div>
  )
}
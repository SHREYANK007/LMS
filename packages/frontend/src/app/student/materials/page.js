'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import PDFViewer from '@/components/PDFViewer'
import {
  BookOpen,
  Filter,
  Search,
  Eye,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  User,
  Tag
} from 'lucide-react'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMaterials()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchTerm, categoryFilter])

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getMaterials()
      if (response.success) {
        setMaterials(response.materials || [])
      } else {
        setError('Failed to load materials')
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
      setError(error.message || 'Failed to load materials')
    } finally {
      setIsLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = materials

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(material => material.courseCategory === categoryFilter)
    }

    setFilteredMaterials(filtered)
  }

  const handleViewMaterial = async (material) => {
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
      case 'NAATI':
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
      case 'NAATI':
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
              Study Materials
            </h1>
            <p className="text-slate-500 text-lg mt-1">Access course resources and study guides</p>
          </div>
        </div>

        <button
          onClick={fetchMaterials}
          disabled={isLoading}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-slate-400" />
            <div className="flex gap-2">
              {['ALL', 'PTE', 'NAATI'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryEmoji(category)} {category === 'ALL' ? 'All Courses' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Materials</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchMaterials}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-20">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchTerm || categoryFilter !== 'ALL' ? 'No Materials Found' : 'No Materials Available'}
          </h3>
          <p className="text-slate-600">
            {searchTerm || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria.'
              : 'Study materials will appear here once uploaded by your tutors.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(material.courseCategory)}`}>
                    {getCategoryEmoji(material.courseCategory)} {material.courseCategory}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    {material.viewCount}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>
                {material.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {material.description}
                  </p>
                )}

                {/* Tags */}
                {material.tags && material.tags.length > 0 && (
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
                      <span className="text-xs text-gray-500">+{material.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* File Info */}
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

                {/* View Button */}
                <button
                  onClick={() => handleViewMaterial(material)}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
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
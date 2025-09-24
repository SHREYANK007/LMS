'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import MaterialCard from '@/components/materials/MaterialCard'
import {
  BookOpen,
  Search,
  Star,
  Clock,
  Download,
  Eye,
  FileText,
  Video,
  Filter,
  ChevronRight,
  RefreshCw,
  FileIcon,
  PlayCircle,
  Folder,
  TrendingUp
} from 'lucide-react'
import { mockStudyMaterials, materialCategories, getVisibleMaterials } from '@/data/mock/mockMaterials'
import { StudyMaterial } from '@/types'
import { theme } from '@/styles/theme'

export default function StudentMaterialsPage() {
  // Mock current student info (in real app, get from auth context)
  const currentStudentCourse = 'PTE' as 'PTE' | 'NAATI' | 'BOTH'

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFileType, setSelectedFileType] = useState<string>('all')
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['1', '2', '8']) // Mock favorites

  // Get materials visible to student
  const visibleMaterials = getVisibleMaterials(currentStudentCourse)

  // Filter materials
  const filteredMaterials = visibleMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    const matchesFileType = selectedFileType === 'all' ||
                           (selectedFileType === 'video' && (material.fileType.includes('video') || material.fileType === 'mp4')) ||
                           (selectedFileType === 'document' && !material.fileType.includes('video') && material.fileType !== 'mp4')

    return matchesSearch && matchesCategory && matchesFileType
  })

  // Get recent materials (last 30 days)
  const recentMaterials = visibleMaterials.filter(material => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return material.createdAt >= thirtyDaysAgo
  })

  // Statistics
  const stats = {
    total: visibleMaterials.length,
    favorites: favoriteIds.length,
    recent: recentMaterials.length,
    downloadable: visibleMaterials.filter(m => m.allowDownload).length,
    videos: visibleMaterials.filter(m => m.fileType.includes('video') || m.fileType === 'mp4').length,
    documents: visibleMaterials.filter(m => !m.fileType.includes('video') && m.fileType !== 'mp4').length
  }

  const handleViewMaterial = (material: StudyMaterial) => {
    // Open in protected viewer
    window.open(`/student/materials/viewer/${material.id}`, '_blank')
  }

  const handleDownloadMaterial = (material: StudyMaterial) => {
    if (!material.allowDownload) {
      alert('This material is not available for download')
      return
    }
    console.log('Downloading material:', material)
  }

  const toggleFavorite = (materialId: string) => {
    setFavoriteIds(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Study Materials
                </h1>
                <p className="text-slate-500 text-lg mt-1">Access your {currentStudentCourse} course materials and resources</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {currentStudentCourse} Resources
              </span>
              <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Materials
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-blue-400">
                  {stats.total}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <p className="text-sm text-slate-300">Total Materials</p>
              <p className="text-xs text-slate-400 mt-2">Available resources</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {stats.favorites}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
              <p className="text-sm text-slate-300">Favorites</p>
              <p className="text-xs text-slate-400 mt-2">Bookmarked items</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-400">
                  {stats.videos}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.videos}</div>
              <p className="text-sm text-slate-300">Video Content</p>
              <p className="text-xs text-slate-400 mt-2">Interactive learning</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {stats.downloadable}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.downloadable}</div>
              <p className="text-sm text-slate-300">Downloadable</p>
              <p className="text-xs text-slate-400 mt-2">Offline access</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
              <p className="text-slate-500">Browse and organize your study materials</p>
            </div>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              View All Categories <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Search Materials</h3>
              <p className="text-slate-600 text-sm mb-4">Find specific resources</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">My Favorites</h3>
              <p className="text-slate-600 text-sm mb-4">Bookmarked content</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Recent Updates</h3>
              <p className="text-slate-600 text-sm mb-4">New this month</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Folder className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Categories</h3>
              <p className="text-slate-600 text-sm mb-4">Browse by type</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Browse Materials</h2>
              <p className="text-slate-500">Search and filter through your study resources</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {materialCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              {/* File Type Filter */}
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">All File Types</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                isFavorite={favoriteIds.includes(material.id)}
                onView={handleViewMaterial}
                onDownload={handleDownloadMaterial}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No materials found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedFileType('all')
                }}
                className="bg-indigo-700 hover:bg-indigo-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
    </div>
  )
}

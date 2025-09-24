'use client'

import { useState } from 'react'
import { StudyMaterial } from '@/types'
import {
  FileText,
  Video,
  Image,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  Lock,
  Globe,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MaterialCardProps {
  material: StudyMaterial
  showActions?: boolean
  onView?: (material: StudyMaterial) => void
  onEdit?: (material: StudyMaterial) => void
  onDelete?: (material: StudyMaterial) => void
  onDownload?: (material: StudyMaterial) => void
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('video') || fileType === 'mp4') return Video
  if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) return Image
  return FileText
}

const getFileTypeColor = (fileType: string) => {
  if (fileType.includes('video') || fileType === 'mp4') return 'text-purple-600 bg-purple-100'
  if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) return 'text-green-600 bg-green-100'
  if (fileType === 'pdf') return 'text-red-600 bg-red-100'
  if (['doc', 'docx'].includes(fileType)) return 'text-blue-600 bg-blue-100'
  if (['xls', 'xlsx'].includes(fileType)) return 'text-green-600 bg-green-100'
  return 'text-gray-600 bg-gray-100'
}

export default function MaterialCard({
  material,
  showActions = true,
  onView,
  onEdit,
  onDelete,
  onDownload
}: MaterialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const FileIcon = getFileIcon(material.fileType)
  const fileColorClass = getFileTypeColor(material.fileType)

  const handleView = () => {
    if (onView) {
      onView(material)
    } else {
      // Default view behavior - open in new tab with protection
      window.open(`/materials/viewer/${material.id}`, '_blank')
    }
  }

  const handleDownload = () => {
    if (!material.allowDownload) {
      alert('Download is not allowed for this material')
      return
    }
    if (onDownload) {
      onDownload(material)
    } else {
      // Default download behavior
      const link = document.createElement('a')
      link.href = material.fileUrl
      link.download = material.title
      link.click()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fileColorClass}`}>
            <FileIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{material.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className={`status-badge ${
                material.courseType === 'PTE' ? 'course-pte' :
                material.courseType === 'NAATI' ? 'course-naati' :
                'bg-indigo-100 text-indigo-800'
              }`}>
                {material.courseType}
              </div>
              <div className="status-badge bg-gray-100 text-gray-700">
                {material.category}
              </div>
            </div>
            <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {material.description}
            </p>
            {material.description && material.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-700 text-sm mt-1"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {material.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
              >
                #{tag}
              </span>
            ))}
            {material.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg">
                +{material.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="capitalize">{material.uploadedByRole}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{material.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              {material.visibility === 'all_course_students' ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>
                {material.visibility === 'all_course_students' ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {material.fileType}
          </div>
        </div>

        {/* Download Warning */}
        {!material.allowDownload && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <p className="text-sm text-orange-700">
              This material is view-only and cannot be downloaded
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-2"
              variant="outline"
            >
              <Eye className="w-4 h-4" />
              View Material
            </Button>

            {material.allowDownload && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {onEdit && (
              <Button
                onClick={() => onEdit(material)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {onDelete && (
              <Button
                onClick={() => onDelete(material)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
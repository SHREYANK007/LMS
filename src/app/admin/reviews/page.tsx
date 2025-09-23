'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'

export default function AdminReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: "Total Reviews",
      value: "284",
      description: "All time reviews",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Average Rating",
      value: "4.7",
      description: "Overall satisfaction",
      icon: Star,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Pending Review",
      value: "12",
      description: "Awaiting moderation",
      icon: Clock,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Flagged Reviews",
      value: "3",
      description: "Need attention",
      icon: Flag,
      color: "from-red-500 to-red-600"
    }
  ]

  const reviews = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      courseName: "PTE Academic Preparation",
      tutorName: "Dr. Michael Chen",
      rating: 5,
      title: "Excellent preparation course!",
      comment: "The PTE course was incredibly comprehensive. Dr. Chen's teaching methods really helped me understand the exam format and improve my scores significantly. I passed with flying colors!",
      date: "2024-12-18",
      status: "approved",
      helpfulVotes: 15,
      reportCount: 0,
      verified: true
    },
    {
      id: 2,
      studentName: "John Smith",
      courseName: "NAATI CCL Preparation",
      tutorName: "Prof. Lisa Wang",
      rating: 4,
      title: "Good course, could use more practice material",
      comment: "The course content was solid and Prof. Wang is very knowledgeable. However, I would have liked more practice materials and mock tests to better prepare for the actual exam.",
      date: "2024-12-17",
      status: "approved",
      helpfulVotes: 8,
      reportCount: 0,
      verified: true
    },
    {
      id: 3,
      studentName: "Emma Wilson",
      courseName: "PTE Speaking Masterclass",
      tutorName: "Dr. Sarah Brown",
      rating: 5,
      title: "Amazing speaking improvement!",
      comment: "My speaking skills improved dramatically after this masterclass. The techniques and feedback provided were invaluable. Highly recommend!",
      date: "2024-12-16",
      status: "pending",
      helpfulVotes: 0,
      reportCount: 0,
      verified: false
    },
    {
      id: 4,
      studentName: "Mike Davis",
      courseName: "PTE Writing Workshop",
      tutorName: "Dr. James Miller",
      rating: 2,
      title: "Disappointing experience",
      comment: "The course didn't meet my expectations. The content seemed outdated and the teaching approach wasn't very engaging.",
      date: "2024-12-15",
      status: "flagged",
      helpfulVotes: 2,
      reportCount: 3,
      verified: true
    }
  ]

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'flagged': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCourseColor = (course: string) => {
    if (course.includes('PTE')) return 'bg-purple-100 text-purple-800'
    if (course.includes('NAATI')) return 'bg-orange-100 text-orange-800'
    return 'bg-indigo-100 text-indigo-800'
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Reviews & Ratings
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage student feedback and course reviews
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4" />
              View Analytics
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
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

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              <option value="PTE">PTE Courses</option>
              <option value="NAATI">NAATI Courses</option>
              <option value="Masterclass">Masterclasses</option>
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Student Reviews</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Export Reviews
            </Button>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{review.studentName}</h4>
                        {review.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" title="Verified Student" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {getRatingStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseColor(review.courseName)}`}>
                          {review.courseName}
                        </span>
                        <span>Tutor: {review.tutorName}</span>
                        <span>Date: {review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {review.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {review.status === 'flagged' && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Flag className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{review.helpfulVotes} helpful</span>
                    </div>
                    {review.reportCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Flag className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">{review.reportCount} reports</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Review ID: #{review.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
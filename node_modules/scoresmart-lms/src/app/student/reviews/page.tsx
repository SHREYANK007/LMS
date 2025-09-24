'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Award,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  BookOpen,
  Users,
  Crown,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Clock
} from 'lucide-react'
import {
  mockTutorInfo,
  getReviewsByStudent,
  getTutorById
} from '@/data/mock/mockReviews'

export default function StudentReviewsPage() {
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'submit'>('my-reviews')
  const [selectedTutor, setSelectedTutor] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)

  // Mock current student ID
  const currentStudentId = 'student1'

  // Get student's own reviews
  const myReviews = getReviewsByStudent(currentStudentId)

  const stats = {
    totalReviews: myReviews.length,
    averageRating: myReviews.length > 0 ? (myReviews.reduce((sum, review) => sum + review.rating, 0) / myReviews.length).toFixed(1) : '0.0',
    pendingReviews: myReviews.filter(r => !r.isApproved).length,
    publishedReviews: myReviews.filter(r => r.isApproved).length
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-6 h-6'
    }

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const handleSubmitReview = () => {
    if (!selectedTutor || !rating || !comment.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Here you would submit the review
    console.log('Submitting review:', {
      tutorId: selectedTutor,
      rating,
      comment,
      isAnonymous
    })

    // Reset form
    setSelectedTutor('')
    setRating(0)
    setComment('')
    setActiveTab('my-reviews')
    alert('Review submitted successfully!')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Reviews & Ratings
              </h1>
              <p className="text-slate-500 text-lg mt-1">Rate your tutors and manage your feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {stats.averageRating} Average
            </span>
            <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-yellow-400">
                +{stats.totalReviews}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalReviews}</div>
            <p className="text-sm text-slate-300">Total Reviews</p>
            <p className="text-xs text-slate-400 mt-2">Your submissions</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {stats.averageRating}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.averageRating}</div>
            <p className="text-sm text-slate-300">Your Average</p>
            <p className="text-xs text-slate-400 mt-2">Rating given</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-400">
                {stats.publishedReviews}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.publishedReviews}</div>
            <p className="text-sm text-slate-300">Published</p>
            <p className="text-xs text-slate-400 mt-2">Live reviews</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-400">
                {stats.pendingReviews}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.pendingReviews}</div>
            <p className="text-sm text-slate-300">Pending</p>
            <p className="text-xs text-slate-400 mt-2">Under review</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-slate-500">Manage your reviews and feedback</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => setActiveTab('my-reviews')}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
              activeTab === 'my-reviews' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">My Reviews</h3>
            <p className="text-slate-600 text-sm mb-4">View your submitted reviews</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              View {stats.totalReviews} reviews
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div
            onClick={() => setActiveTab('submit')}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
              activeTab === 'submit' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Write Review</h3>
            <p className="text-slate-600 text-sm mb-4">Rate your tutors</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Submit Feedback
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'my-reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">My Reviews</h2>
              <p className="text-slate-500">Your submitted feedback and ratings</p>
            </div>
            <Button onClick={() => setActiveTab('submit')} className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Write New Review
            </Button>
          </div>

          {myReviews.length > 0 ? (
            <div className="space-y-4">
              {myReviews.map((review) => {
                const tutor = getTutorById(review.tutorId)
                return (
                  <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {tutor?.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{tutor?.name}</h3>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating, 'sm')}
                            <span className="text-sm text-slate-600">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{review.createdAt.toLocaleDateString()}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.isApproved ? 'Published' : 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4">{review.comment}</p>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      {!review.isApproved && (
                        <Button variant="ghost" size="sm" className="gap-2">
                          Edit Review
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</h3>
              <p className="text-slate-600 mb-6">
                Share your experience by writing your first review
              </p>
              <Button onClick={() => setActiveTab('submit')} className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Write Your First Review
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Write a Review</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Tutor *
                </label>
                <select
                  value={selectedTutor}
                  onChange={(e) => setSelectedTutor(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Choose a tutor to review...</option>
                  {mockTutorInfo.map(tutor => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, 'lg', true)}
                  <span className="ml-2 text-sm text-slate-600">
                    {rating > 0 ? `${rating}/5` : 'Click to rate'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this tutor. What did you like about their teaching style? How did they help you improve?"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-slate-700">
                  Submit as anonymous review
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Review Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Be honest and constructive in your feedback</li>
                      <li>• Focus on the tutor's teaching methods and helpfulness</li>
                      <li>• Keep your review professional and respectful</li>
                      <li>• Reviews are moderated before publication</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSubmitReview}
                  className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2"
                >
                  <Star className="w-4 h-4" />
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('my-reviews')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
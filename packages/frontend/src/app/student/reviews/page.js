'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';

export default function StudentReviewsPage() {
  const { user } = useAuth();
  const [assignedTutors, setAssignedTutors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignedTutors();
  }, []);

  const fetchAssignedTutors = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      // Fetch assigned tutors
      const response = await fetch(`${apiUrl}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.assignedTutors) {
          setAssignedTutors(data.user.assignedTutors);
          // Fetch reviews for each assigned tutor
          await fetchReviewsForTutors(data.user.assignedTutors);
        }
      } else {
        setError('Failed to fetch assigned tutors');
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsForTutors = async (tutors) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const token = localStorage.getItem('token');
    const allReviews = [];

    for (const tutor of tutors) {
      try {
        const response = await fetch(`${apiUrl}/reviews/tutor/${tutor.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          allReviews.push({
            tutorId: tutor.id,
            tutorName: tutor.name || tutor.email,
            reviews: data.reviews || [],
            stats: data.stats || { totalReviews: 0, averageRating: 0 }
          });
        }
      } catch (error) {
        console.error(`Error fetching reviews for tutor ${tutor.id}:`, error);
      }
    }

    setReviews(allReviews);
  };

  const handleCreateReview = async (tutorId) => {
    const tutor = assignedTutors.find(t => t.id === tutorId);
    setSelectedTutor(tutor);
    setShowReviewModal(true);
    setReviewForm({ rating: 5, comment: '' });
  };

  const submitReview = async () => {
    if (!selectedTutor) return;

    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tutor_id: selectedTutor.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim() || null
        })
      });

      if (response.ok) {
        setShowReviewModal(false);
        setSelectedTutor(null);
        // Refresh reviews
        await fetchAssignedTutors();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const hasReviewedTutor = (tutorId) => {
    const tutorReviews = reviews.find(r => r.tutorId === tutorId);
    return tutorReviews?.reviews.some(review => review.student.id === user?.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Reviews</h1>
        <p className="text-gray-600">
          Review your assigned tutors and see what other students think
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {assignedTutors.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Tutors</h3>
          <p className="text-gray-600">
            You don't have any assigned tutors yet. Contact your administrator to get assigned to a tutor.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignedTutors.map((tutor) => {
            const tutorReviews = reviews.find(r => r.tutorId === tutor.id);
            const hasReviewed = hasReviewedTutor(tutor.id);

            return (
              <div key={tutor.id} className="bg-white rounded-lg shadow border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tutor.name || tutor.email}
                    </h3>
                    <p className="text-gray-600">{tutor.email}</p>
                    {tutorReviews && tutorReviews.stats.totalReviews > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(Math.round(tutorReviews.stats.averageRating))}
                        <span className="text-sm text-gray-600">
                          {tutorReviews.stats.averageRating.toFixed(1)}
                          ({tutorReviews.stats.totalReviews} review{tutorReviews.stats.totalReviews !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>

                  {!hasReviewed && (
                    <button
                      onClick={() => handleCreateReview(tutor.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Write Review
                    </button>
                  )}
                </div>

                {/* Reviews List */}
                {tutorReviews && tutorReviews.reviews.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Student Reviews:</h4>
                    {tutorReviews.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600">
                              by {review.student.name || review.student.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tutorReviews && tutorReviews.reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet for this tutor
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review {selectedTutor.name || selectedTutor.email}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this tutor..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
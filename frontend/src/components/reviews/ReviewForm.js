import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';

const ReviewForm = ({ projectId, revieweeId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      setError('Please provide a comment for your review.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getToken();

      await axios.post(
        'http://localhost:8000/api/reviews/',
        {
          project: projectId,
          reviewee: revieweeId,
          rating: formData.rating,
          comment: formData.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Call the callback function to notify the parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h5 className="mb-3">Write a Review</h5>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <div className="rating-input d-flex">
            {[1, 2, 3, 4, 5].map(star => (
              <div key={star} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rating"
                  id={`rating-${star}`}
                  value={star}
                  checked={formData.rating === star}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor={`rating-${star}`}>
                  <i
                    className={`bi ${formData.rating >= star ? 'bi-star-fill' : 'bi-star'} text-warning fs-4`}
                  ></i>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Your Review
          </label>
          <textarea
            className="form-control"
            id="comment"
            name="comment"
            rows="4"
            placeholder="Share your experience..."
            value={formData.comment}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>Submit Review
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onReviewSubmitted && onReviewSubmitted()}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

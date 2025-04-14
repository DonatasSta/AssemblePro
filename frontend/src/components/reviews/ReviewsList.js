import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewsList = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchReviews();
    }
  }, [userId]);
  
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/for_user/?user_id=${userId}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 mb-0">Loading reviews...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-muted mb-0">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <div className="d-flex align-items-center mb-3">
        <div className="me-3">
          <span className="h3 text-primary">{averageRating.toFixed(1)}</span>
          <span className="text-muted">/{reviews.length} reviews</span>
        </div>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <i 
              key={star} 
              className={`bi ${star <= Math.round(averageRating) ? 'bi-star-fill' : 'bi-star'} text-warning fs-4`}
            ></i>
          ))}
        </div>
      </div>
      
      {reviews.map(review => (
        <div key={review.id} className="mb-3 pb-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong>{review.reviewer_name}</strong>
              <span className="text-muted ms-2">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
                ></i>
              ))}
            </div>
          </div>
          <p className="mb-1">{review.comment}</p>
          <small className="text-muted">
            Project: {review.project_title}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, isAuthenticated } from '../../utils/auth';

const ServiceDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch service details using relative URL
        const serviceResponse = await axios.get(`/api/services/${id}/`);
        setService(serviceResponse.data);
        
        // Fetch provider details
        const providerId = serviceResponse.data.provider;
        const providerResponse = await axios.get(`/api/profiles/${providerId}/`);
        setProvider(providerResponse.data);
        
        // Fetch reviews for provider
        const reviewsResponse = await axios.get(`/api/reviews/for_user/?user_id=${providerId}`);
        setReviews(reviewsResponse.data);
        
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [id]);
  
  const handleContactProvider = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (!messageText.trim()) {
      return;
    }
    
    setMessageSending(true);
    
    try {
      const token = getToken();
      
      // Using relative URL for API
      await axios.post(
        '/api/messages/',
        {
          receiver: service.provider,
          content: messageText
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setMessageSent(true);
      setMessageText('');
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setMessageSending(false);
    }
  };
  
  const isOwnService = user && service && user.id === service.provider;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading service details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/services" className="btn btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }
  
  if (!service || !provider) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Service not found.
        </div>
        <div className="text-center mt-3">
          <Link to="/services" className="btn btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title mb-3">{service.title}</h2>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-success fs-5">£{service.hourly_rate}/hour</span>
                <span className={`badge ${service.is_available ? 'bg-success' : 'bg-danger'}`}>
                  {service.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
              
              <div className="mb-4">
                <h4>Description</h4>
                <p className="mb-0">{service.description}</p>
              </div>
              
              <div className="mb-4">
                <h4>Experience</h4>
                <p className="mb-0">
                  {service.experience_years} {service.experience_years === 1 ? 'year' : 'years'} of experience in furniture assembly
                </p>
              </div>
              
              {isOwnService && (
                <div className="d-grid gap-2">
                  <Link to={`/services/${service.id}/edit`} className="btn btn-primary">
                    <i className="bi bi-pencil me-1"></i> Edit Service
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews section */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="h5 mb-0">Reviews for {provider.username}</h3>
            </div>
            <div className="card-body">
              {reviews.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-star text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 mb-0">No reviews yet for this provider.</p>
                </div>
              ) : (
                <div>
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
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 card-title mb-0">About the Provider</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-2 mb-0">{provider.first_name} {provider.last_name}</h4>
                <p className="text-muted">@{provider.username}</p>
                
                {provider.average_rating > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="me-1">{provider.average_rating.toFixed(1)}</span>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi ${i < Math.round(provider.average_rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
                        ))}
                      </div>
                      <span className="ms-1">({reviews.length})</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <p className="text-muted mb-1">
                  <i className="bi bi-geo-alt me-1"></i> {provider.location || 'Location not specified'}
                </p>
                <p className="text-muted mb-3">
                  <i className="bi bi-calendar me-1"></i> Member since {new Date(provider.date_joined).toLocaleDateString()}
                </p>
              </div>
              
              <p className="mb-4">
                {provider.bio || 'No bio available'}
              </p>
              
              <div className="d-grid">
                {!isOwnService && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="collapse"
                    data-bs-target="#contactForm"
                    aria-expanded="false"
                    aria-controls="contactForm"
                  >
                    <i className="bi bi-chat-dots me-1"></i> Contact Provider
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {!isOwnService && (
            <div className="collapse mb-4" id="contactForm">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4 className="h5 mb-0">Send Message</h4>
                </div>
                <div className="card-body">
                  {messageSent ? (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Message sent successfully! The provider will respond to you soon.
                    </div>
                  ) : !isAuthenticated() ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      You need to <Link to="/login">login</Link> to contact this provider.
                    </div>
                  ) : (
                    <form onSubmit={handleContactProvider}>
                      <div className="mb-3">
                        <label htmlFor="messageText" className="form-label">Your Message</label>
                        <textarea
                          className="form-control"
                          id="messageText"
                          rows="4"
                          placeholder="Describe your needs, ask questions about the service..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={messageSending}
                      >
                        {messageSending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-1"></i> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="d-grid">
            <Link to="/services" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i> Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

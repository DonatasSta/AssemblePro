import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../utils/api';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    phone: '',
    is_assembler: false
  });
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        is_assembler: user.is_assembler || false
      });
      
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user's services
      const servicesResponse = await apiService.getUserServices();
      setServices(servicesResponse.data);
      
      // Fetch user's projects
      const projectsResponse = await apiService.getUserProjects();
      setProjects(projectsResponse.data);
      
      // Fetch reviews about the user
      const reviewsResponse = await apiService.getUserReviews(user.id);
      setReviews(reviewsResponse.data);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Use apiService to update profile
      const response = await apiService.updateProfile(formData);
      
      // Update the user in parent component
      setUser({
        ...user,
        ...response.data
      });
      
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-person-circle text-primary" style={{ fontSize: '5rem' }}></i>
              </div>
              <h3 className="mb-0">{user.first_name} {user.last_name}</h3>
              <p className="text-muted">@{user.username}</p>
              {user.is_assembler && (
                <div className="mb-2">
                  <span className="badge bg-success">Furniture Assembler</span>
                </div>
              )}
              {user.average_rating > 0 && (
                <div className="mb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="me-1">{user.average_rating.toFixed(1)}</span>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi ${i < Math.round(user.average_rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
                      ))}
                    </div>
                    <span className="ms-1">({reviews.length} reviews)</span>
                  </div>
                </div>
              )}
              <p className="text-muted mb-3">
                <i className="bi bi-geo-alt me-1"></i> {user.location || 'No location set'}
              </p>
              <p className="text-muted mb-3">
                <i className="bi bi-telephone me-1"></i> {user.phone || 'No phone number'}
              </p>
              <p className="mb-4">
                {user.bio || 'No bio available'}
              </p>
              <button 
                className="btn btn-primary w-100" 
                onClick={() => setEditMode(true)}
              >
                <i className="bi bi-pencil me-1"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          {editMode ? (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">Edit Profile</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="first_name" className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">{errors.first_name}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="last_name" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">{errors.last_name}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_assembler"
                        name="is_assembler"
                        checked={formData.is_assembler}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="is_assembler">
                        I want to offer assembly services
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                      id="bio"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                    ></textarea>
                    {errors.bio && (
                      <div className="invalid-feedback">{errors.bio}</div>
                    )}
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">My Services</h4>
                  {user.is_assembler && (
                    <Link to="/services/create" className="btn btn-primary btn-sm">
                      <i className="bi bi-plus-lg me-1"></i> Add Service
                    </Link>
                  )}
                </div>
                <div className="card-body">
                  {services.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-tools text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-2 mb-0">
                        {user.is_assembler 
                          ? "You haven't created any services yet."
                          : "You aren't registered as an assembler. Update your profile to offer services."}
                      </p>
                      {user.is_assembler && (
                        <Link to="/services/create" className="btn btn-outline-primary mt-3">
                          Create Your First Service
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="list-group">
                      {services.map(service => (
                        <Link 
                          to={`/services/${service.id}`} 
                          className="list-group-item list-group-item-action" 
                          key={service.id}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{service.title}</h5>
                            <span className="badge bg-success">${service.hourly_rate}/hour</span>
                          </div>
                          <p className="mb-1 text-truncate">{service.description}</p>
                          <small className="text-muted">
                            {service.is_available ? 'Available' : 'Not Available'} • 
                            {service.experience_years} {service.experience_years === 1 ? 'year' : 'years'} experience
                          </small>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">My Projects</h4>
                  <Link to="/projects/create" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1"></i> Post Project
                  </Link>
                </div>
                <div className="card-body">
                  {projects.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-clipboard text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-2 mb-0">You haven't created any projects yet.</p>
                      <Link to="/projects/create" className="btn btn-outline-primary mt-3">
                        Post Your First Project
                      </Link>
                    </div>
                  ) : (
                    <div className="list-group">
                      {projects.map(project => (
                        <Link 
                          to={`/projects/${project.id}`} 
                          className="list-group-item list-group-item-action" 
                          key={project.id}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{project.title}</h5>
                            <span className={`badge ${
                              project.status === 'open' ? 'bg-primary' : 
                              project.status === 'in_progress' ? 'bg-warning' : 
                              project.status === 'completed' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="mb-1 text-truncate">{project.description}</p>
                          <small className="text-muted">
                            {project.furniture_type} • Budget: ${project.budget} • {project.location}
                          </small>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card shadow-sm">
                <div className="card-header">
                  <h4 className="mb-0">Reviews</h4>
                </div>
                <div className="card-body">
                  {reviews.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-star text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-2 mb-0">No reviews yet.</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

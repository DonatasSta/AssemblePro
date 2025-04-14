import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../utils/auth';

const CreateService = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hourly_rate: '',
    experience_years: '',
    is_available: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.hourly_rate) {
      newErrors.hourly_rate = 'Hourly rate is required';
    } else if (isNaN(formData.hourly_rate) || parseFloat(formData.hourly_rate) <= 0) {
      newErrors.hourly_rate = 'Hourly rate must be a positive number';
    }
    
    if (!formData.experience_years) {
      newErrors.experience_years = 'Experience years is required';
    } else if (isNaN(formData.experience_years) || parseInt(formData.experience_years) < 0) {
      newErrors.experience_years = 'Experience years must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:8000/api/services/',
        {
          ...formData,
          hourly_rate: parseFloat(formData.hourly_rate),
          experience_years: parseInt(formData.experience_years)
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Redirect to the newly created service page
      navigate(`/services/${response.data.id}`);
      
    } catch (err) {
      console.error('Error creating service:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Create Your Assembly Service</h2>
            </div>
            <div className="card-body">
              {errors.non_field_errors && (
                <div className="alert alert-danger">
                  {errors.non_field_errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Service Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., IKEA Furniture Assembly Expert"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your assembly service, experience, and what types of furniture you specialize in..."
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="hourly_rate" className="form-label">Hourly Rate ($) *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.hourly_rate ? 'is-invalid' : ''}`}
                      id="hourly_rate"
                      name="hourly_rate"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                      placeholder="25.00"
                    />
                    {errors.hourly_rate && (
                      <div className="invalid-feedback">{errors.hourly_rate}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="experience_years" className="form-label">Years of Experience *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.experience_years ? 'is-invalid' : ''}`}
                      id="experience_years"
                      name="experience_years"
                      min="0"
                      value={formData.experience_years}
                      onChange={handleChange}
                    />
                    {errors.experience_years && (
                      <div className="invalid-feedback">{errors.experience_years}</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_available"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_available">
                      This service is currently available
                    </label>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Create Service'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/services')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../utils/auth';

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    furniture_type: '',
    location: '',
    budget: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Common furniture types for dropdown
  const furnitureTypes = [
    'Wardrobe', 'Bed', 'Couch', 'Desk', 'Chair', 'Table', 'Bookshelf', 
    'Cabinet', 'Entertainment Center', 'Dresser', 'Shelving Unit', 'Other'
  ];

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
    
    if (!formData.furniture_type.trim()) {
      newErrors.furniture_type = 'Furniture type is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
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
        'http://localhost:8000/api/projects/',
        {
          ...formData,
          budget: parseFloat(formData.budget)
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Redirect to the newly created project page
      navigate(`/projects/${response.data.id}`);
      
    } catch (err) {
      console.error('Error creating project:', err);
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
              <h2 className="h4 mb-0">Post a Furniture Assembly Project</h2>
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
                  <label htmlFor="title" className="form-label">Project Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., IKEA PAX Wardrobe Assembly"
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
                    placeholder="Describe your project in detail, including dimensions, complexity, and any special requirements..."
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="furniture_type" className="form-label">Furniture Type *</label>
                  <select
                    className={`form-select ${errors.furniture_type ? 'is-invalid' : ''}`}
                    id="furniture_type"
                    name="furniture_type"
                    value={formData.furniture_type}
                    onChange={handleChange}
                  >
                    <option value="">Select furniture type</option>
                    {furnitureTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.furniture_type && (
                    <div className="invalid-feedback">{errors.furniture_type}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Your address or general area (e.g., North End, Boston, MA)"
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="budget" className="form-label">Budget ($) *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="100.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.budget && (
                    <div className="invalid-feedback">{errors.budget}</div>
                  )}
                  <small className="form-text text-muted">
                    Set a reasonable budget for your project. This helps attract qualified assemblers.
                  </small>
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
                        Posting...
                      </>
                    ) : 'Post Project'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/projects')}
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

export default CreateProject;

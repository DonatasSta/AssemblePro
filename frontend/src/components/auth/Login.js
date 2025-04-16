import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setTokens } from '../../utils/auth';
import apiService from '../../utils/api';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fallback direct fetch function in case axios has issues
  const directFetch = async (url, options = {}) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    const fullUrl = `${baseURL}${url}`;
    console.log('Direct fetch to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Direct fetch error:', response.status, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { ...formData, password: '****' });
      
      let tokenData;
      
      try {
        // First try using the API service
        console.log('Trying login via apiService...');
        const response = await apiService.login(formData);
        console.log('Login response via apiService:', response);
        tokenData = response.data;
      } catch (apiError) {
        console.error('API service login failed, trying direct fetch:', apiError);
        
        // Fallback to direct fetch if apiService fails
        const directResponse = await directFetch('/token/', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        console.log('Login response via direct fetch:', directResponse);
        tokenData = directResponse;
      }
      
      // Check if we have the tokens
      if (!tokenData || !tokenData.access) {
        throw new Error('No access token received from server');
      }
      
      // Store tokens in local storage
      setTokens(tokenData);
      console.log('Tokens stored, fetching profile...');
      
      // Add a small delay to ensure token is stored
      setTimeout(async () => {
        try {
          // Fetch user data
          let userData;
          
          try {
            // Try using API service first
            const userResponse = await apiService.getProfile();
            console.log('User profile response via apiService:', userResponse);
            userData = userResponse.data;
          } catch (profileApiError) {
            console.error('API service profile fetch failed, trying direct fetch:', profileApiError);
            
            // Fallback to direct fetch
            const token = localStorage.getItem('assembleally_access_token');
            userData = await directFetch('/profiles/me/', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log('User profile response via direct fetch:', userData);
          }
          
          // Set user in parent component
          setUser(userData);
          
          // Redirect to homepage
          navigate('/');
        } catch (profileErr) {
          console.error('Profile fetch error:', profileErr);
          setError('Successfully logged in but failed to fetch your profile. Please refresh the page.');
          // Still navigate to homepage since login was successful
          navigate('/');
        } finally {
          setLoading(false);
        }
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Log detailed error information
      console.log('Error type:', typeof err);
      console.log('Error message:', err.message);
      console.log('Error name:', err.name);
      console.log('Error stack:', err.stack);
      
      if (err.response) {
        console.log('Error response:', err.response);
        console.log('Response status:', err.response.status);
        console.log('Response headers:', err.response.headers);
        console.log('Response data:', err.response.data);
        
        if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data) {
          // Check for specific error fields in the response
          const errorMessage = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          setError(errorMessage || 'Invalid username or password. Please try again.');
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        console.log('Error request (no response):', err.request);
        setError('No response from server. Please check your connection and try again.');
      } else {
        console.log('Unknown error:', err);
        setError(`Error: ${err.message || 'An unknown error occurred during login'}`);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-2">Login to Assembleally</h3>
                <p className="text-muted">Enter your credentials to access your account</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : 'Login'}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="text-primary">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

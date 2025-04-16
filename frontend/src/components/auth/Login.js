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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { ...formData, password: '****' });
      
      // Use the apiService to login
      const response = await apiService.login(formData);
      console.log('Login response:', response);
      
      // Check if we have the tokens
      if (!response.data || !response.data.access) {
        throw new Error('No access token received from server');
      }
      
      // Store tokens in local storage
      setTokens(response.data);
      console.log('Tokens stored, fetching profile...');
      
      // Add a small delay to ensure token is stored
      setTimeout(async () => {
        try {
          // Fetch user data
          const userResponse = await apiService.getProfile();
          console.log('User profile response:', userResponse);
          
          // Set user in parent component
          setUser(userResponse.data);
          
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
      if (err.response && err.response.data) {
        console.log('Error response data:', err.response.data);
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Invalid username or password. Please try again.');
        }
      } else {
        console.log('Unknown error type:', err);
        setError('An error occurred during login. Please try again.');
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

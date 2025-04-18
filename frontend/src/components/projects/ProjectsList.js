import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../utils/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [furnitureType, setFurnitureType] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [status, setStatus] = useState('open');
  const [sortBy, setSortBy] = useState('-created_at');

  useEffect(() => {
    fetchProjects();
  }, [status, sortBy]); // Re-fetch when these change

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ordering: sortBy,
      };

      if (status) {
        params.status = status;
      }

      const response = await apiService.getProjects(params);
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();

    const params = {
      ordering: sortBy,
    };

    if (status) {
      params.status = status;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (furnitureType) {
      params.furniture_type = furnitureType;
    }

    if (minBudget) {
      params.budget__gte = minBudget;
    }

    if (maxBudget) {
      params.budget__lte = maxBudget;
    }

    setLoading(true);
    setError(null);

    apiService
      .getProjects(params)
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching projects:', err);
        setError('Failed to search projects. Please try again.');
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFurnitureType('');
    setMinBudget('');
    setMaxBudget('');
    setStatus('open');
    setSortBy('-created_at');
    fetchProjects();
  };

  // Common furniture types for the filter dropdown
  const commonFurnitureTypes = [
    'Wardrobe',
    'Bed',
    'Couch',
    'Desk',
    'Chair',
    'Table',
    'Bookshelf',
    'Cabinet',
    'Entertainment Center',
  ];

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2>Furniture Assembly Projects</h2>
          <p className="text-muted">
            Browse projects posted by people who need furniture assembled
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title h5 mb-0">Filters</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="searchTerm" className="form-label">
                    Search
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchTerm"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="furnitureType" className="form-label">
                    Furniture Type
                  </label>
                  <select
                    className="form-select"
                    id="furnitureType"
                    value={furnitureType}
                    onChange={e => setFurnitureType(e.target.value)}
                  >
                    <option value="">Any Type</option>
                    {commonFurnitureTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Budget Range (£)</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={minBudget}
                        onChange={e => setMinBudget(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={maxBudget}
                        onChange={e => setMaxBudget(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Project Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="">Any Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="sortBy" className="form-label">
                    Sort By
                  </label>
                  <select
                    className="form-select"
                    id="sortBy"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="budget">Budget (Low to High)</option>
                    <option value="-budget">Budget (High to Low)</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-search me-1"></i> Apply Filters
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-3 mb-2">No Projects Found</h3>
                <p className="text-muted mb-4">
                  We couldn't find any furniture assembly projects matching your criteria.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-outline-primary" onClick={resetFilters}>
                    Clear Filters
                  </button>
                  <Link to="/projects/create" className="btn btn-primary">
                    Post a Project
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0">
                  Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                </p>
                <Link to="/projects/create" className="btn btn-primary btn-sm">
                  <i className="bi bi-plus-lg me-1"></i> Post a Project
                </Link>
              </div>

              <div className="card shadow-sm">
                <div className="list-group list-group-flush">
                  {projects.map(project => (
                    <Link
                      to={`/projects/${project.id}`}
                      className="list-group-item list-group-item-action p-4"
                      key={project.id}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="h5 mb-0">{project.title}</h4>
                        <span
                          className={`badge ${
                            project.status === 'open'
                              ? 'bg-primary'
                              : project.status === 'in_progress'
                                ? 'bg-warning'
                                : project.status === 'completed'
                                  ? 'bg-success'
                                  : 'bg-danger'
                          }`}
                        >
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="mb-3">
                        {project.description.length > 150
                          ? `${project.description.substring(0, 150)}...`
                          : project.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center text-muted">
                        <div>
                          <small className="d-block d-md-inline me-md-3">
                            <i className="bi bi-tag me-1"></i> {project.furniture_type}
                          </small>
                          <small className="d-block d-md-inline me-md-3">
                            <i className="bi bi-geo-alt me-1"></i> {project.location}
                          </small>
                          <small className="d-block d-md-inline">
                            <i className="bi bi-person me-1"></i> {project.creator_name}
                          </small>
                        </div>
                        <div className="text-primary fw-bold">£{project.budget}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;

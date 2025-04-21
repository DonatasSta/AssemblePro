import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [minHourlyRate, setMinHourlyRate] = useState('');
  const [maxHourlyRate, setMaxHourlyRate] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [availableOnly, sortBy]); // Re-fetch when these change

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using relative URL for API
      let url = `/api/services/?ordering=${sortBy}`;

      if (availableOnly) {
        url += '&is_available=true';
      }

      const response = await axios.get(url);
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();

    // Using relative URL for API
    let url = `/api/services/?ordering=${sortBy}`;

    if (availableOnly) {
      url += '&is_available=true';
    }

    if (searchTerm) {
      url += `&search=${searchTerm}`;
    }

    if (minHourlyRate) {
      url += `&hourly_rate__gte=${minHourlyRate}`;
    }

    if (maxHourlyRate) {
      url += `&hourly_rate__lte=${maxHourlyRate}`;
    }

    if (minExperience) {
      url += `&experience_years__gte=${minExperience}`;
    }

    setLoading(true);
    setError(null);

    axios
      .get(url)
      .then(response => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching services:', err);
        setError('Failed to search services. Please try again.');
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinHourlyRate('');
    setMaxHourlyRate('');
    setMinExperience('');
    setSortBy('-created_at');
    setAvailableOnly(true);
    fetchServices();
  };

  // Filter services after loaded
  const filteredServices = services.filter(service => {
    let matches = true;

    // This is for client-side filtering if needed, but primarily using server-side filtering above
    return matches;
  });

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2>Furniture Assembly Services</h2>
          <p className="text-muted">Find skilled assemblers to help with your furniture</p>
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
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Hourly Rate (£)</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={minHourlyRate}
                        onChange={e => setMinHourlyRate(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={maxHourlyRate}
                        onChange={e => setMaxHourlyRate(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="minExperience" className="form-label">
                    Minimum Experience (years)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="minExperience"
                    placeholder="Minimum years"
                    value={minExperience}
                    onChange={e => setMinExperience(e.target.value)}
                    min="0"
                  />
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
                    <option value="hourly_rate">Hourly Rate (Low to High)</option>
                    <option value="-hourly_rate">Hourly Rate (High to Low)</option>
                    <option value="-experience_years">Experience (High to Low)</option>
                  </select>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="availableOnly"
                    checked={availableOnly}
                    onChange={e => setAvailableOnly(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="availableOnly">
                    Available Services Only
                  </label>
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
              <p className="mt-2">Loading services...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-tools text-muted" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-3 mb-2">No Services Found</h3>
                <p className="text-muted mb-4">
                  We couldn&apos;t find any assembly services matching your criteria.
                </p>
                <button className="btn btn-outline-primary" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3">
                Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
              </p>

              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredServices.map(service => (
                  <div className="col" key={service.id}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="card-title h5">{service.title}</h3>
                          <span className="badge bg-success">£{service.hourly_rate}/hour</span>
                        </div>

                        <p className="card-text text-muted mb-3">{service.description}</p>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="d-block">
                              <i className="bi bi-person me-1"></i> {service.provider_name}
                            </span>
                            <span className="d-block">
                              <i className="bi bi-briefcase me-1"></i> {service.experience_years}{' '}
                              {service.experience_years === 1 ? 'year' : 'years'} experience
                            </span>
                          </div>

                          {service.provider_rating > 0 && (
                            <div className="text-warning">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`bi ${i < Math.round(service.provider_rating) ? 'bi-star-fill' : 'bi-star'}`}
                                ></i>
                              ))}
                            </div>
                          )}
                        </div>

                        <Link to={`/services/${service.id}`} className="btn btn-primary w-100">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesList;

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Section - Airbnb-like clean design */}
      <section className="pt-5 pb-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
                Furniture Assembly, <span className="text-primary">Simplified</span>
              </h1>
              <p className="lead mb-4 fs-4 fw-light text-secondary">
                Connect with skilled local assemblers or find assembly projects nearby.
                FurnitureHeroes makes furniture setup stress-free.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-5">
                <Link to="/services" className="btn btn-primary rounded-pill px-4 py-3 fs-5 fw-semibold">
                  Find Assemblers
                </Link>
                <Link to="/projects" className="btn btn-outline-dark rounded-pill px-4 py-3 fs-5">
                  Browse Projects
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Furniture assembly" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ objectFit: 'cover', height: '500px', width: '100%' }}
                />
                <div className="position-absolute bottom-0 end-0 bg-white rounded-4 shadow p-4 mb-4 me-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="bi bi-tools fs-1 text-primary"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 fs-5">Professional Assembly</h4>
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-half text-warning"></i>
                        </div>
                        <span>4.8 (243 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Airbnb-inspired */}
      <section className="py-6 bg-light">
        <div className="container">
          <h2 className="text-center fs-1 fw-bold mb-2">How FurnitureHeroes Works</h2>
          <p className="text-center text-secondary mb-5 fs-5">Three simple steps to get your furniture assembled</p>
          
          <div className="row g-4 g-lg-5 mt-3">
            <div className="col-md-4">
              <div className="card border-0 bg-transparent h-100">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="bi bi-1-circle-fill"></i>
                </div>
                <div className="card-body ps-0">
                  <h3 className="fs-3 fw-semibold mb-3">Create Your Profile</h3>
                  <p className="text-secondary fs-5">
                    Sign up as an assembler offering your skills or as someone looking for furniture assembly help.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 bg-transparent h-100">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="bi bi-2-circle-fill"></i>
                </div>
                <div className="card-body ps-0">
                  <h3 className="fs-3 fw-semibold mb-3">Connect</h3>
                  <p className="text-secondary fs-5">
                    Browse through available assemblers or post your project with all details to find the perfect match.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 bg-transparent h-100">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="bi bi-3-circle-fill"></i>
                </div>
                <div className="card-body ps-0">
                  <h3 className="fs-3 fw-semibold mb-3">Get It Done</h3>
                  <p className="text-secondary fs-5">
                    Coordinate details through our messaging system, complete the assembly, and leave a review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services & Projects - Airbnb card style */}
      <section className="py-6">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="fs-1 fw-bold mb-4">Available Assemblers</h2>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div className="bg-light p-3 text-center" style={{ height: '200px' }}>
                  <i className="bi bi-tools" style={{ fontSize: '80px', color: '#e91e63' }}></i>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">IKEA Specialist</h5>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-semibold">4.9</span>
                    </div>
                  </div>
                  <p className="card-text text-secondary mb-3">
                    Expert with all IKEA products with 5+ years experience. Fast and reliable service.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-5 fw-semibold text-primary">$35/hour</span>
                    <Link to="/services" className="btn btn-outline-primary rounded-pill px-3">View More</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div className="bg-light p-3 text-center" style={{ height: '200px' }}>
                  <i className="bi bi-gear" style={{ fontSize: '80px', color: '#673ab7' }}></i>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">Assembly Pro</h5>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-semibold">4.7</span>
                    </div>
                  </div>
                  <p className="card-text text-secondary mb-3">
                    Specialized in complex furniture. Will handle the toughest assembly challenges.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-5 fw-semibold text-primary">$45/hour</span>
                    <Link to="/services" className="btn btn-outline-primary rounded-pill px-3">View More</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div className="bg-light p-3 text-center" style={{ height: '200px' }}>
                  <i className="bi bi-hammer" style={{ fontSize: '80px', color: '#2196f3' }}></i>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">Rapid Assembly</h5>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-semibold">4.8</span>
                    </div>
                  </div>
                  <p className="card-text text-secondary mb-3">
                    Quick and efficient service for those who need their furniture assembled ASAP.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-5 fw-semibold text-primary">$40/hour</span>
                    <Link to="/services" className="btn btn-outline-primary rounded-pill px-3">View More</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/services" className="btn btn-primary rounded-pill px-4 py-2 fs-5">
              View All Assemblers
            </Link>
          </div>
          
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <h2 className="fs-1 fw-bold mb-4">Popular Projects</h2>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">Wardrobe Assembly</h5>
                    <span className="badge bg-primary rounded-pill px-3 py-2">$150</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-geo-alt text-secondary me-2"></i>
                    <span className="text-secondary">New York, NY</span>
                  </div>
                  <p className="card-text mb-3">
                    IKEA PAX wardrobe with sliding doors. All materials available, need assembly this weekend.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar text-secondary me-2"></i>
                      <span className="text-secondary">Posted 2 days ago</span>
                    </div>
                    <Link to="/projects" className="btn btn-outline-primary rounded-pill px-3">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">Office Setup</h5>
                    <span className="badge bg-primary rounded-pill px-3 py-2">$75</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-geo-alt text-secondary me-2"></i>
                    <span className="text-secondary">Chicago, IL</span>
                  </div>
                  <p className="card-text mb-3">
                    Standing desk and ergonomic chair setup needed. All tools should be provided.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar text-secondary me-2"></i>
                      <span className="text-secondary">Posted 1 day ago</span>
                    </div>
                    <Link to="/projects" className="btn btn-outline-primary rounded-pill px-3">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fs-4 fw-semibold">Bookshelves Installation</h5>
                    <span className="badge bg-primary rounded-pill px-3 py-2">$120</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-geo-alt text-secondary me-2"></i>
                    <span className="text-secondary">Austin, TX</span>
                  </div>
                  <p className="card-text mb-3">
                    Need help installing three large BILLY bookshelves and securing them to the wall.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar text-secondary me-2"></i>
                      <span className="text-secondary">Posted 3 days ago</span>
                    </div>
                    <Link to="/projects" className="btn btn-outline-primary rounded-pill px-3">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/projects" className="btn btn-primary rounded-pill px-4 py-2 fs-5">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Airbnb-inspired */}
      <section className="py-6 bg-light mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg rounded-4 p-5">
                <div className="card-body text-center">
                  <h2 className="display-5 fw-bold mb-4">Ready to get started?</h2>
                  <p className="lead fs-4 mb-5 text-secondary">
                    Join our community today and start finding assemblers or projects in your area.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Link to="/register" className="btn btn-primary rounded-pill px-5 py-3 fs-5 fw-semibold">
                      Sign Up Now
                    </Link>
                    <Link to="/login" className="btn btn-outline-secondary rounded-pill px-5 py-3 fs-5">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

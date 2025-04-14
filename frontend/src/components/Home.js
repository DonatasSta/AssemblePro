import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Furniture Assembly Made Easy</h1>
              <p className="lead mb-4">
                Connect with skilled assemblers or find furniture assembly projects in your area.
                Assembleally makes it simple to get your furniture put together right.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/services" className="btn btn-light btn-lg px-4">
                  Find Assemblers
                </Link>
                <Link to="/projects" className="btn btn-outline-light btn-lg px-4">
                  Browse Projects
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0 text-center">
              <div className="bg-white rounded p-3 shadow-lg d-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="6" rx="2" />
                  <rect x="4" y="16" width="16" height="6" rx="2" />
                  <path d="M12 8v8" />
                  <path d="M8 8v8" />
                  <path d="M16 8v8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How Assembleally Works</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-white rounded shadow-sm p-4 h-100">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person-plus text-white fs-2"></i>
                </div>
                <h3 className="h5 mb-3">Create Your Profile</h3>
                <p className="text-muted">
                  Sign up and create your profile as an assembler or someone looking for assembly services.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-white rounded shadow-sm p-4 h-100">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-search text-white fs-2"></i>
                </div>
                <h3 className="h5 mb-3">Find or Post</h3>
                <p className="text-muted">
                  Browse available assemblers or post your furniture assembly project with all the details.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-white rounded shadow-sm p-4 h-100">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-check2-circle text-white fs-2"></i>
                </div>
                <h3 className="h5 mb-3">Connect & Complete</h3>
                <p className="text-muted">
                  Message, arrange, and complete the assembly. Then leave a review about your experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Projects Preview */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-6">
              <h2 className="mb-4">Available Assemblers</h2>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="bi bi-person-circle fs-1 text-primary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="card-title">IKEA Furniture Specialist</h5>
                      <p className="card-text text-muted">
                        5+ years experience with all IKEA products. Fast and reliable service.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-success">$35/hour</span>
                        <Link to="/services" className="btn btn-sm btn-outline-primary">View More</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="bi bi-person-circle fs-1 text-primary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="card-title">Complex Furniture Assembly Pro</h5>
                      <p className="card-text text-muted">
                        Specialized in complex furniture pieces. Will handle the toughest assembly challenges.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-success">$45/hour</span>
                        <Link to="/services" className="btn btn-sm btn-outline-primary">View More</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/services" className="btn btn-primary">
                  View All Assemblers
                </Link>
              </div>
            </div>
            
            <div className="col-md-6 mt-4 mt-md-0">
              <h2 className="mb-4">Latest Projects</h2>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Wardrobe Assembly Needed</h5>
                  <p className="card-text text-muted">
                    IKEA PAX wardrobe with sliding doors. All materials available, need assembly this weekend.
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-info">Budget: $150</span>
                    <Link to="/projects" className="btn btn-sm btn-outline-primary">View More</Link>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Office Desk & Chair Setup</h5>
                  <p className="card-text text-muted">
                    Need help setting up a standing desk and ergonomic chair. All tools should be provided.
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-info">Budget: $75</span>
                    <Link to="/projects" className="btn btn-sm btn-outline-primary">View More</Link>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/projects" className="btn btn-primary">
                  View All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-5 bg-secondary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Ready to get started?</h2>
          <p className="lead mb-4">
            Join our community today and start finding assemblers or projects in your area.
          </p>
          <Link to="/register" className="btn btn-light btn-lg px-4 me-2">
            Sign Up Now
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg px-4">
            Login
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;

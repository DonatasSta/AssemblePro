import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">Assembleally</h5>
            <p className="text-muted">
              Connecting people who need furniture assembled with skilled assemblers.
            </p>
          </div>

          <div className="col-md-2 mb-3 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-decoration-none text-muted">
                  Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/projects" className="text-decoration-none text-muted">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3 mb-md-0">
            <h6 className="mb-3">User</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login" className="text-decoration-none text-muted">
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-decoration-none text-muted">
                  Register
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-decoration-none text-muted">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="mb-3">Connect With Us</h6>
            <div className="d-flex">
              <a href="#" className="text-decoration-none text-muted me-3">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none text-muted me-3">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none text-muted me-3">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none text-muted">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-3 bg-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} Assembleally. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="small text-muted mb-0">
              <Link to="#" className="text-decoration-none text-muted me-3">
                Privacy Policy
              </Link>
              <Link to="#" className="text-decoration-none text-muted">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

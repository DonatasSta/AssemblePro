import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navigation = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-tools me-2 text-primary"></i>
          <span className="fw-bold fs-4">FurnitureHeroes</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <div className="d-lg-flex justify-content-between align-items-center w-100">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-lg-2">
                <Link className="nav-link rounded-pill px-3" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-lg-2">
                <Link className="nav-link rounded-pill px-3" to="/services">
                  Find Assemblers
                </Link>
              </li>
              <li className="nav-item mx-lg-2">
                <Link className="nav-link rounded-pill px-3" to="/projects">
                  Browse Projects
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              {user ? (
                <div className="d-flex align-items-center">
                  <li className="nav-item me-3">
                    <Link className="nav-link position-relative" to="/messages">
                      <i className="bi bi-envelope fs-5"></i>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        2<span className="visually-hidden">unread messages</span>
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="btn rounded-pill d-flex align-items-center border"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-list me-2"></i>
                      <i className="bi bi-person-circle"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                      <li>
                        <Link className="dropdown-item py-2" to="/profile">
                          <i className="bi bi-person me-2"></i>My Profile
                        </Link>
                      </li>
                      {user.is_assembler && (
                        <li>
                          <Link className="dropdown-item py-2" to="/services/create">
                            <i className="bi bi-plus-circle me-2"></i>Create Service
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link className="dropdown-item py-2" to="/projects/create">
                          <i className="bi bi-plus-circle me-2"></i>Post Project
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </div>
              ) : (
                <div className="d-flex">
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary rounded-pill px-3" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

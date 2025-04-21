import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, isAuthenticated } from '../../utils/auth';
import ReviewForm from '../reviews/ReviewForm';

const ProjectDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  const [assembler, setAssembler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch project details
      const projectResponse = await axios.get(`http://localhost:8000/api/projects/${id}/`);
      setProject(projectResponse.data);

      // Fetch creator details
      const creatorId = projectResponse.data.creator;
      const creatorResponse = await axios.get(`http://localhost:8000/api/profiles/${creatorId}/`);
      setCreator(creatorResponse.data);

      // Fetch assembler details if assigned
      if (projectResponse.data.assigned_to) {
        const assemblerId = projectResponse.data.assigned_to;
        const assemblerResponse = await axios.get(
          `http://localhost:8000/api/profiles/${assemblerId}/`
        );
        setAssembler(assemblerResponse.data);
      } else {
        setAssembler(null);
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUser = async (e, recipientId) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!messageText.trim()) {
      return;
    }

    setMessageSending(true);

    try {
      const token = getToken();

      await axios.post(
        'http://localhost:8000/api/messages/',
        {
          receiver: recipientId,
          content: messageText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessageSent(true);
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setMessageSending(false);
    }
  };

  const handleAssignProject = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setStatusUpdating(true);
    setAssignError('');

    try {
      const token = getToken();

      const response = await axios.patch(
        `http://localhost:8000/api/projects/${id}/assign/`,
        { assigned_to: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject(response.data);
      fetchProjectDetails(); // Refresh all data
    } catch (err) {
      console.error('Error assigning project:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setAssignError(err.response.data.detail);
      } else {
        setAssignError('Failed to assign project. Please try again.');
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleUpdateStatus = async newStatus => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setStatusUpdating(true);

    try {
      const token = getToken();

      const response = await axios.patch(
        `http://localhost:8000/api/projects/${id}/update_status/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject(response.data);
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status. Please try again.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const isCreator = user && project && user.id === project.creator;
  const isAssignedAssembler = user && project && project.assigned_to === user.id;
  const canReview = project && project.status === 'completed' && (isCreator || isAssignedAssembler);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project || !creator) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Project not found.
        </div>
        <div className="text-center mt-3">
          <Link to="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title mb-0">{project.title}</h2>
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

              <p className="mb-4">{project.description}</p>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h4 className="h5">Project Details</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>
                        <i className="bi bi-tag me-2"></i>Furniture Type:
                      </strong>{' '}
                      {project.furniture_type}
                    </li>
                    <li className="mb-2">
                      <strong>
                        <i className="bi bi-geo-alt me-2"></i>Location:
                      </strong>{' '}
                      {project.location}
                    </li>
                    <li>
                      <strong>
                        <i className="bi bi-calendar me-2"></i>Posted:
                      </strong>{' '}
                      {new Date(project.created_at).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h4 className="h5 mb-3">Budget</h4>
                      <span className="display-6 text-primary">${project.budget}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project actions for creator */}
              {isCreator && (
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h4 className="h5 mb-3">Project Management</h4>

                    {project.status === 'open' && (
                      <div className="mb-3">
                        <p>Your project is open and waiting for an assembler.</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUpdateStatus('cancelled')}
                          disabled={statusUpdating}
                        >
                          {statusUpdating ? (
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <i className="bi bi-x-circle me-2"></i>
                          )}
                          Cancel Project
                        </button>
                      </div>
                    )}

                    {project.status === 'in_progress' && (
                      <div className="mb-3">
                        <p>Your project is being worked on by {project.assigned_to_name}.</p>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success"
                            onClick={() => handleUpdateStatus('completed')}
                            disabled={statusUpdating}
                          >
                            {statusUpdating ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <i className="bi bi-check-circle me-2"></i>
                            )}
                            Mark as Completed
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleUpdateStatus('cancelled')}
                            disabled={statusUpdating}
                          >
                            {statusUpdating ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <i className="bi bi-x-circle me-2"></i>
                            )}
                            Cancel Project
                          </button>
                        </div>
                      </div>
                    )}

                    {project.status === 'completed' && !showReviewForm && (
                      <div className="mb-3">
                        <p>This project has been completed. Would you like to leave a review?</p>
                        <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>
                          <i className="bi bi-star me-2"></i>Leave Review
                        </button>
                      </div>
                    )}

                    {showReviewForm && isCreator && project.status === 'completed' && (
                      <ReviewForm
                        projectId={project.id}
                        revieweeId={project.assigned_to}
                        onReviewSubmitted={() => {
                          setShowReviewForm(false);
                          fetchProjectDetails();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Project actions for assembler */}
              {isAssignedAssembler && (
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h4 className="h5 mb-3">Assembler Actions</h4>

                    {project.status === 'in_progress' && (
                      <p>You&apos;re currently working on this project.</p>
                    )}

                    {project.status === 'completed' && !showReviewForm && (
                      <div className="mb-3">
                        <p>
                          This project has been completed. Would you like to leave a review for the
                          client?
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>
                          <i className="bi bi-star me-2"></i>Leave Review
                        </button>
                      </div>
                    )}

                    {showReviewForm && isAssignedAssembler && project.status === 'completed' && (
                      <ReviewForm
                        projectId={project.id}
                        revieweeId={project.creator}
                        onReviewSubmitted={() => {
                          setShowReviewForm(false);
                          fetchProjectDetails();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Take this project button for assemblers */}
              {user &&
                user.profile &&
                user.profile.is_assembler &&
                !isCreator &&
                !isAssignedAssembler &&
                project.status === 'open' && (
                  <div className="card bg-light mb-4">
                    <div className="card-body">
                      <h4 className="h5 mb-3">Interested in this project?</h4>

                      {assignError && <div className="alert alert-danger mb-3">{assignError}</div>}

                      <button
                        className="btn btn-success"
                        onClick={handleAssignProject}
                        disabled={statusUpdating}
                      >
                        {statusUpdating ? (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <i className="bi bi-check-circle me-2"></i>
                        )}
                        Take this Project
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 card-title mb-0">Project Creator</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-2 mb-0">
                  {creator.first_name} {creator.last_name}
                </h4>
                <p className="text-muted">@{creator.username}</p>

                {creator.average_rating > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="me-1">{creator.average_rating.toFixed(1)}</span>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < Math.round(creator.average_rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">
                  <i className="bi bi-geo-alt me-1"></i>{' '}
                  {creator.location || 'No location specified'}
                </p>
                <p className="text-muted mb-3">
                  <i className="bi bi-calendar me-1"></i> Member since{' '}
                  {new Date(creator.date_joined).toLocaleDateString()}
                </p>
              </div>

              {!isCreator && (
                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="collapse"
                    data-bs-target="#contactCreatorForm"
                    aria-expanded="false"
                    aria-controls="contactCreatorForm"
                  >
                    <i className="bi bi-chat-dots me-1"></i> Contact Creator
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assembler info card if project is assigned */}
          {project.assigned_to && assembler && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h3 className="h5 card-title mb-0">Assigned Assembler</h3>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <i className="bi bi-person-circle text-success" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-2 mb-0">
                    {assembler.first_name} {assembler.last_name}
                  </h4>
                  <p className="text-muted">@{assembler.username}</p>

                  {assembler.average_rating > 0 && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="me-1">{assembler.average_rating.toFixed(1)}</span>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bi ${i < Math.round(assembler.average_rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-muted mb-1">
                    <i className="bi bi-geo-alt me-1"></i>{' '}
                    {assembler.location || 'No location specified'}
                  </p>
                </div>

                {isCreator && !isAssignedAssembler && (
                  <div className="d-grid">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="collapse"
                      data-bs-target="#contactAssemblerForm"
                      aria-expanded="false"
                      aria-controls="contactAssemblerForm"
                    >
                      <i className="bi bi-chat-dots me-1"></i> Contact Assembler
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Creator Form */}
          {!isCreator && (
            <div className="collapse mb-4" id="contactCreatorForm">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4 className="h5 mb-0">Message to Creator</h4>
                </div>
                <div className="card-body">
                  {messageSent ? (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Message sent successfully!
                    </div>
                  ) : !isAuthenticated() ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      You need to <Link to="/login">login</Link> to contact the creator.
                    </div>
                  ) : (
                    <form onSubmit={e => handleContactUser(e, project.creator)}>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Ask questions about the project..."
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={messageSending}
                      >
                        {messageSending ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-1"></i> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Assembler Form */}
          {isCreator && project.assigned_to && (
            <div className="collapse mb-4" id="contactAssemblerForm">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4 className="h5 mb-0">Message to Assembler</h4>
                </div>
                <div className="card-body">
                  {messageSent ? (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Message sent successfully!
                    </div>
                  ) : (
                    <form onSubmit={e => handleContactUser(e, project.assigned_to)}>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Send details, instructions, or questions..."
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={messageSending}
                      >
                        {messageSending ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-1"></i> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="d-grid">
            <Link to="/projects" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

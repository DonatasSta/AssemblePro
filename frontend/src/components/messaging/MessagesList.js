import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../utils/auth';

const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8000/api/messages/conversations/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations(response.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Check if it's this week
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    if (date > oneWeekAgo) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    // Otherwise return the date
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Messages</h2>
            </div>

            {conversations.length === 0 ? (
              <div className="card-body text-center py-5">
                <i className="bi bi-chat-dots text-muted" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-3 mb-2">No Conversations Yet</h3>
                <p className="text-muted mb-0">
                  Your message history will appear here once you start chatting with other users.
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {conversations.map(conversation => (
                  <Link
                    to={`/messages/${conversation.user.id}`}
                    className="list-group-item list-group-item-action p-3"
                    key={conversation.user.id}
                  >
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i
                          className="bi bi-person-circle text-primary"
                          style={{ fontSize: '2.5rem' }}
                        ></i>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">
                            {conversation.user.first_name} {conversation.user.last_name}
                            <span className="text-muted ms-2">@{conversation.user.username}</span>
                          </h5>
                          <small className="text-muted">
                            {conversation.latest_message
                              ? formatTimestamp(conversation.latest_message.created_at)
                              : ''}
                          </small>
                        </div>
                        <p className="mb-0 text-truncate">
                          {conversation.latest_message
                            ? conversation.latest_message.content
                            : 'No messages yet'}
                        </p>
                      </div>

                      {conversation.unread_count > 0 && (
                        <div className="ms-3">
                          <span className="badge bg-danger rounded-pill">
                            {conversation.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;

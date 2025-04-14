import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../utils/auth';

const Conversation = () => {
  const { userId } = useParams();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Fetch messages on component mount and when userId changes
  useEffect(() => {
    fetchMessages();
    
    // Polling for new messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/messages/with_user/?user_id=${userId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setMessages(response.data);
      
      // Get other user's profile
      const userResponse = await axios.get(
        `http://localhost:8000/api/profiles/${userId}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setOtherUser(userResponse.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) {
      return;
    }
    
    setSending(true);
    
    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:8000/api/messages/',
        {
          receiver: userId,
          content: messageText
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Add the new message to the list
      setMessages([...messages, response.data]);
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString();
  };

  if (loading && messages.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading conversation...</p>
      </div>
    );
  }
  
  if (error && messages.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/messages" className="btn btn-primary">
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              {otherUser && (
                <div className="d-flex align-items-center">
                  <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem' }}></i>
                  <h4 className="h5 mb-0">
                    {otherUser.first_name} {otherUser.last_name} ({otherUser.username})
                  </h4>
                </div>
              )}
              <Link to="/messages" className="btn btn-sm btn-light">
                <i className="bi bi-arrow-left me-1"></i> Back
              </Link>
            </div>
            
            <div className="card-body p-0">
              <div className="conversation-container p-3" style={{ height: '400px', overflowY: 'auto' }}>
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-chat text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 mb-0">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="message-date-divider text-center my-3">
                      <small className="text-muted">
                        {new Date(messages[0]?.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    
                    {messages.map((message, index) => {
                      // Check if we need to add a date divider
                      const showDateDivider = index > 0 && 
                        new Date(message.created_at).toLocaleDateString() !== 
                        new Date(messages[index - 1].created_at).toLocaleDateString();
                      
                      const isReceived = message.sender_name !== otherUser?.username;
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showDateDivider && (
                            <div className="message-date-divider text-center my-3">
                              <small className="text-muted">
                                {new Date(message.created_at).toLocaleDateString()}
                              </small>
                            </div>
                          )}
                          
                          <div className={`message-bubble mb-3 ${isReceived ? 'message-sent' : 'message-received'}`}>
                            <div className={`card ${isReceived ? 'bg-primary text-white' : 'bg-light'}`}>
                              <div className="card-body py-2 px-3">
                                <p className="mb-0">{message.content}</p>
                              </div>
                            </div>
                            <small className={`d-block mt-1 ${isReceived ? 'text-end' : ''} text-muted`}>
                              {formatTimestamp(message.created_at)}
                            </small>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    
                    {/* Empty div for scrolling to bottom */}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>
            
            <div className="card-footer">
              {error && messages.length > 0 && (
                <div className="alert alert-danger py-2 mb-2">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={sending}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={sending || !messageText.trim()}
                  >
                    {sending ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-send"></i>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

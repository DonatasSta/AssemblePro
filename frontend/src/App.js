import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import ServicesList from './components/services/ServicesList';
import ServiceDetail from './components/services/ServiceDetail';
import CreateService from './components/services/CreateService';
import ProjectsList from './components/projects/ProjectsList';
import ProjectDetail from './components/projects/ProjectDetail';
import CreateProject from './components/projects/CreateProject';
import MessagesList from './components/messaging/MessagesList';
import Conversation from './components/messaging/Conversation';
import { getUser, isAuthenticated } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      console.log('Checking if user is authenticated:', isAuthenticated());
      if (isAuthenticated()) {
        try {
          console.log('Getting user data...');
          const userData = await getUser();
          console.log('User data received:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('User not authenticated');
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="container mt-5 text-center">Loading...</div>;

    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation user={user} setUser={setUser} />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route path="/services" element={<ServicesList />} />
          <Route path="/services/:id" element={<ServiceDetail user={user} />} />
          <Route
            path="/services/create"
            element={
              <ProtectedRoute>
                <CreateService />
              </ProtectedRoute>
            }
          />

          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetail user={user} />} />
          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <ProtectedRoute>
                <Conversation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

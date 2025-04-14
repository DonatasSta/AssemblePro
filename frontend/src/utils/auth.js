// Token storage keys
const ACCESS_TOKEN_KEY = 'assembleally_access_token';
const REFRESH_TOKEN_KEY = 'assembleally_refresh_token';
const USER_KEY = 'assembleally_user';

// Function to store tokens in localStorage
export const setTokens = ({ access, refresh, user }) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Function to get the access token
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Function to get the refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Function to get the cached user data
export const getStoredUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Function to logout by removing tokens
export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Function to get the current user from API
export const getUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    const token = getToken();
    const response = await fetch('http://localhost:8000/api/profiles/me/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

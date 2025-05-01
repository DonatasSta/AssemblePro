// Token storage keys
const ACCESS_TOKEN_KEY = 'furnitureheroes_access_token';
const REFRESH_TOKEN_KEY = 'furnitureheroes_refresh_token';
const USER_KEY = 'furnitureheroes_user';

// Function to store tokens in localStorage
export const setTokens = tokenData => {
  if (tokenData.access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.access);
  }

  if (tokenData.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh);
  }

  if (tokenData.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(tokenData.user));
  }

  console.log('Tokens stored successfully:', {
    access: !!tokenData.access,
    refresh: !!tokenData.refresh,
    user: !!tokenData.user,
  });
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
    console.log('getUser: Not authenticated');
    return null;
  }

  try {
    const token = getToken();
    console.log('getUser: Token exists:', !!token);

    // First try to get from localStorage if available
    const cachedUser = getStoredUser();
    if (cachedUser) {
      console.log('getUser: Returning cached user');
      return cachedUser;
    }

    const apiUrl = process.env.VITE_API_URL || '/api';
    console.log('getUser: Fetching from API', `${apiUrl}/profiles/me/`);

    const response = await fetch(`${apiUrl}/profiles/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('getUser: Response not OK', response.status);
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    console.log('getUser: User data received', userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

/**
 * Authentication Service
 * Maps to the FastAPI backend endpoints at /auth
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000';

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(username, fullName, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        full_name: fullName,
        email: email,
        password: password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    
    return response.json();
  },

  /**
   * Verify an email using a token
   * GET /auth/verify-email?token={token}
   */
  async verifyEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Email verification failed');
    }
    
    return response.json();
  },

  /**
   * Log in user to obtain JWT
   * POST /auth/login
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid email or password');
    }
    
    const data = await response.json();
    
    // Store token globally
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    return data;
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('access_token');
  },

  /**
   * Check Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};

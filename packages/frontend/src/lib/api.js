const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('API Client initialized with base URL:', this.baseURL);
  }

  getAuthHeader() {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
    };

    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : undefined
    });

    try {
      const response = await fetch(url, config);
      console.log('📡 API Response Status:', response.status, response.statusText);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        data = { error: 'Invalid JSON response from server' };
      }

      console.log('📦 API Response Data:', data);

      if (!response.ok) {
        throw new Error(data.error || `API request failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request error:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Admin endpoints
  async getAllUsers(role = null) {
    const query = role ? `?role=${role}` : '';
    return this.request(`/admin/users${query}`);
  }

  async createUser(email, password, role) {
    return this.request('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async resetUserPassword(userId, password = null) {
    return this.request(`/admin/reset-password/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Session endpoints
  async getAllSessions() {
    return this.request('/sessions');
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(sessionId, sessionData) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(sessionId) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiClient();
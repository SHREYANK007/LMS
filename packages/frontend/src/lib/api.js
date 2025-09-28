const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

    // Check if body is FormData
    const isFormData = options.body instanceof FormData;

    const config = {
      ...options,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...this.getAuthHeader(),
        ...options.headers,
      },
    };

    // Handle body based on type
    if (options.body && !isFormData) {
      config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: isFormData ? '[FormData]' : (config.body ? JSON.parse(config.body) : undefined)
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
        // Handle specific error codes
        if (data.code === 'ACCOUNT_DEACTIVATED') {
          // Don't logout automatically, let the app handle the deactivated state
          const error = new Error(data.error || 'Account deactivated');
          error.code = 'ACCOUNT_DEACTIVATED';
          throw error;
        }

        // Handle authentication errors (expired/invalid tokens)
        if (response.status === 401 && (data.error === 'Invalid token' || data.error === 'Token expired')) {
          // Clear stored token and user data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          // Redirect to login page
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
        }

        throw new Error(data.error || `API request failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request error:', error.message);
      console.error('Full error:', error);

      // Propagate account deactivated errors with proper code
      if (error.code === 'ACCOUNT_DEACTIVATED') {
        const deactivatedError = new Error(error.message);
        deactivatedError.code = 'ACCOUNT_DEACTIVATED';
        throw deactivatedError;
      }

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

  async fetchUserProfile() {
    const response = await this.request('/api/me');
    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async updateProfile(profileData) {
    const response = await this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    if (response.success && response.user) {
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

  async toggleUserStatus(userId, isActive) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
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

  async createMasterclass(masterclassData) {
    return this.request('/sessions/masterclass', {
      method: 'POST',
      body: JSON.stringify(masterclassData),
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

  // Session Request endpoints
  async getSessionRequests() {
    return this.request('/session-requests');
  }

  async getMySessionRequests() {
    return this.request('/session-requests/my-requests');
  }

  async createSessionRequest(requestData) {
    return this.request('/session-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async assignTutorToRequest(requestId, tutorId, adminNotes, scheduledDateTime) {
    return this.request(`/session-requests/${requestId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ tutorId, adminNotes, scheduledDateTime }),
    });
  }

  async updateRequestStatus(requestId, status, rejectionReason) {
    return this.request(`/session-requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  async cancelSessionRequest(requestId) {
    return this.request(`/session-requests/${requestId}/cancel`, {
      method: 'PUT',
    });
  }

  async adminCancelSessionRequest(requestId, cancellationReason) {
    return this.request(`/session-requests/${requestId}/admin-cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason }),
    });
  }

  // Tutor endpoints
  async getTutorSessionRequests() {
    return this.request('/tutor/session-requests');
  }

  // Materials endpoints
  async getMaterials() {
    return this.request('/materials');
  }

  async uploadMaterial(formData) {
    return this.request('/materials', {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
  }

  async getMaterialDetails(materialId) {
    return this.request(`/materials/${materialId}`);
  }

  async viewMaterial(materialId) {
    const response = await fetch(`${this.baseURL}/materials/${materialId}/view`, {
      headers: this.getAuthHeader(),
    });
    return response;
  }

  async deleteMaterial(materialId) {
    return this.request(`/materials/${materialId}`, {
      method: 'DELETE',
    });
  }

  async getMaterialsAnalytics() {
    return this.request('/materials/analytics/stats');
  }

  // Announcement endpoints
  async getAnnouncements(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/announcements${query ? `?${query}` : ''}`);
  }

  async getAnnouncement(id) {
    return this.request(`/announcements/${id}`);
  }

  async createAnnouncement(announcementData) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id, announcementData) {
    return this.request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id) {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  async acknowledgeAnnouncement(id) {
    return this.request(`/announcements/${id}/acknowledge`, {
      method: 'POST',
    });
  }

  async getAnnouncementAnalytics() {
    return this.request('/announcements/analytics/stats');
  }

  async getMyAnnouncements(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/announcements/my/announcements${query ? `?${query}` : ''}`);
  }

  // Support Ticket endpoints
  async getSupportTickets(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/support-tickets${query ? `?${query}` : ''}`);
  }

  async getSupportTicket(id) {
    return this.request(`/support-tickets/${id}`);
  }

  async createSupportTicket(ticketData) {
    return this.request('/support-tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateSupportTicket(id, ticketData) {
    return this.request(`/support-tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }

  async addTicketReply(id, replyData) {
    return this.request(`/support-tickets/${id}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }

  async getSupportTicketStats() {
    return this.request('/support-tickets/stats');
  }
}

export default new ApiClient();
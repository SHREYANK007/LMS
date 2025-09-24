const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface CreateSessionData {
  title: string
  description: string
  startTime: string
  endTime: string
  sessionType: 'ONE_TO_ONE' | 'SMART_QUAD' | 'MASTERCLASS'
  courseType: 'PTE' | 'IELTS' | 'TOEFL' | 'GENERAL_ENGLISH' | 'BUSINESS_ENGLISH' | 'ACADEMIC_WRITING'
  maxParticipants?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || `HTTP Error: ${response.status}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.session || data.sessions || data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Session endpoints
  async createSession(sessionData: CreateSessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  }

  async getTodaySessions() {
    return this.request('/sessions/today', {
      method: 'GET',
    })
  }

  async getAllSessions(params?: { tutorId?: string; upcoming?: boolean }) {
    const searchParams = new URLSearchParams()
    if (params?.tutorId) searchParams.set('tutorId', params.tutorId)
    if (params?.upcoming) searchParams.set('upcoming', 'true')

    const query = searchParams.toString()
    return this.request(`/sessions${query ? `?${query}` : ''}`, {
      method: 'GET',
    })
  }

  async getSessionById(sessionId: string) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'GET',
    })
  }

  async updateSession(sessionId: string, updateData: Partial<CreateSessionData>) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async deleteSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
export type { CreateSessionData, ApiResponse }
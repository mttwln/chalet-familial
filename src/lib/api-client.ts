/**
 * API client for making authenticated requests to the backend
 */

const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get the stored auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth-token');
}

/**
 * Set the auth token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('auth-token', token);
}

/**
 * Remove the auth token
 */
export function removeAuthToken(): void {
  localStorage.removeItem('auth-token');
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Une erreur est survenue',
      };
    }

    return {
      data,
      message: data.message,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      error: 'Erreur de connexion au serveur',
    };
  }
}

// Authentication API
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  async register(name: string, email: string, password: string) {
    const response = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  logout() {
    removeAuthToken();
  },
};

// Members API
export const membersApi = {
  async getAll() {
    return apiRequest('/members', {
      method: 'GET',
    });
  },

  async update(id: string, data: { name: string; email: string; role: string }) {
    return apiRequest('/members', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async delete(id: string) {
    return apiRequest('/members', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Reservations API
export const reservationsApi = {
  async getAll() {
    return apiRequest('/reservations', {
      method: 'GET',
    });
  },

  async create(data: {
    memberId: string;
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    status: string;
  }) {
    return apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<{
    memberId: string;
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    status: string;
  }>) {
    return apiRequest('/reservations', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async delete(id: string) {
    return apiRequest('/reservations', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Consumption API
export const consumptionApi = {
  async getAll() {
    return apiRequest('/consumption', {
      method: 'GET',
    });
  },

  async create(data: {
    type: 'fioul' | 'electricite';
    date: string;
    quantity: number;
    cost: number;
  }) {
    return apiRequest('/consumption', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<{
    type: 'fioul' | 'electricite';
    date: string;
    quantity: number;
    cost: number;
  }>) {
    return apiRequest('/consumption', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async delete(id: string) {
    return apiRequest('/consumption', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Database setup API
export const setupApi = {
  async initialize() {
    return apiRequest('/setup', {
      method: 'POST',
    });
  },
};

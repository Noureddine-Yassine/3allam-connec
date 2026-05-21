// Configuration API pour M3allam Connect
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Authentification
    auth: {
      providerRegister: '/api/auth/provider/register',
      providerLogin: '/api/auth/provider/login',
      firebaseLogin: '/api/auth/firebase',
      adminLogin: '/api/auth/admin/login',
    },
    // Public
    public: {
      providers: '/api/providers',
      requests: '/api/requests',
    },
    // Providers
    providers: {
      me: '/api/providers/me',
      requests: '/api/providers/me/requests',
    },
    // Admin
    admin: {
      providers: '/api/admin/providers',
      providerDetail: '/api/admin/providers',
      validateProvider: '/api/admin/providers',
      rejectProvider: '/api/admin/providers',
      requests: '/api/admin/requests',
      stats: '/api/admin/stats',
    },
  },
};

/** Réponse API : tableau direct ou enveloppe Spring Page ({ content, data, ... }). */
export type PaginatedResponse<T> = T[] | { content?: T[]; data?: T[] };

/** Extrait un tableau depuis une réponse API (liste ou page paginée). */
export function unwrapListResponse<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as { content?: T[]; data?: T[] };
    return obj.content ?? obj.data ?? [];
  }
  return [];
}

// Helper function pour les appels API
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseURL}${endpoint}`;

  // FormData must not use Content-Type: application/json — the browser sets
  // multipart boundary. Forcing JSON here breaks public request submission.
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const defaultOptions: RequestInit = {
    headers: isFormData
      ? {}
      : {
          'Content-Type': 'application/json',
        },
    ...options,
  };

  // Ajouter le token d'authentification si disponible
  let token = localStorage.getItem('authToken') || localStorage.getItem('token');
  console.log('API Request - Token found:', !!token);
  console.log('API Request - Endpoint:', endpoint);
  
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  } else {
    console.warn('API Request - No auth token found, request may fail');
  }


  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        console.warn('API Request - Authentication failed (401), clearing tokens');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Fonctions API spécifiques
export const authApi = {
  // Login Admin
  adminLogin: (email: string, password: string) =>
    apiRequest(apiConfig.endpoints.auth.adminLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Login Provider
  providerLogin: (email: string, password: string) =>
    apiRequest(apiConfig.endpoints.auth.providerLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Firebase Login
  firebaseLogin: (firebaseToken: string) =>
    apiRequest(apiConfig.endpoints.auth.firebaseLogin, {
      method: 'POST',
      body: JSON.stringify({ firebaseToken }),
    }),

  // Register Provider (multipart)
  providerRegister: (data: any, profilePhoto?: File | null, cinDocument?: File | null, certificate?: File | null) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    if (cinDocument) formData.append('cinDocument', cinDocument);
    if (certificate) formData.append('certificate', certificate);

    return fetch(`${apiConfig.baseURL}${apiConfig.endpoints.auth.providerRegister}`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
};

export const publicApi = {
  // Create service request (multipart)
  createRequest: (data: any, video?: File) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (video) formData.append('video', video);
    
    return apiRequest(apiConfig.endpoints.public.requests, {
      method: 'POST',
      body: formData,
    });
  },

  // Get all providers (public, paginated)
  getProviders: (city?: string, serviceType?: string) => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (serviceType) params.append('serviceType', serviceType);
    const url = params.toString() ? `${apiConfig.endpoints.public.providers}?${params.toString()}` : apiConfig.endpoints.public.providers;
    console.log('publicApi.getProviders - URL:', url);
    return apiRequest(url);
  },

  // Get provider profile by ID (public)
  getProviderProfile: (id: string) =>
    apiRequest(`${apiConfig.endpoints.public.providers}/${id}`),
};

export const providerApi = {
  // Get provider profile
  getProfile: () =>
    apiRequest(apiConfig.endpoints.providers.me),

  // Update provider profile (multipart)
  updateProfile: (data: any, profilePhoto?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    const token = localStorage.getItem('authToken');
    return fetch(`${apiConfig.baseURL}${apiConfig.endpoints.providers.me}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(res => res.json());
  },

  // Get provider's assigned requests
  getMyRequests: () =>
    apiRequest(apiConfig.endpoints.providers.requests),
};

export const adminApi = {
  // Get stats
  getStats: () =>
    apiRequest(apiConfig.endpoints.admin.stats),

  // Get providers
  getProviders: (status?: string, city?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (city) params.append('city', city);
    const url = params.toString() ? `${apiConfig.endpoints.admin.providers}?${params.toString()}` : apiConfig.endpoints.admin.providers;
    return apiRequest<PaginatedResponse<Record<string, unknown>>>(url);
  },

  // Get provider detail
  getProviderDetail: (id: string) =>
    apiRequest(`${apiConfig.endpoints.admin.providerDetail}/${id}`),

  // Validate provider
  validateProvider: (id: string) =>
    apiRequest(`${apiConfig.endpoints.admin.validateProvider}/${id}/validate`, {
      method: 'PUT',
    }),

  // Reject provider
  rejectProvider: (id: string) =>
    apiRequest(`${apiConfig.endpoints.admin.rejectProvider}/${id}/reject`, {
      method: 'PUT',
    }),

  // Delete provider
  deleteProvider: (id: string) =>
    apiRequest(`${apiConfig.endpoints.admin.providers}/${id}`, {
      method: 'DELETE',
    }),

  // Get all requests
  getRequests: (status?: string, serviceType?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (serviceType) params.append('serviceType', serviceType);
    const url = params.toString() ? `${apiConfig.endpoints.admin.requests}?${params.toString()}` : apiConfig.endpoints.admin.requests;
    return apiRequest<PaginatedResponse<Record<string, unknown>>>(url);
  },
};

export default apiConfig;

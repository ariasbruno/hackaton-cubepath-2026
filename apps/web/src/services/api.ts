import { useDebugStore } from '../store/useDebugStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const GAME_SERVER_HTTP = WS_URL.replace('ws://', 'http://').replace('wss://', 'https://');

interface ExtendedRequestInit extends RequestInit {
  silent?: boolean;
}

export const apiClient = async <T>(endpoint: string, options?: ExtendedRequestInit): Promise<T> => {
  const txId = Math.random().toString(36).substring(7);
  const start = Date.now();
  const silent = options?.silent;

  const reqHeaders: Record<string, string> = {};
  if (options?.headers) {
    Object.entries(options.headers).forEach(([k, v]) => reqHeaders[k] = v);
  }

  if (!silent) {
    useDebugStore.getState().addTransaction({
      id: txId,
      method: options?.method || 'GET',
      endpoint,
      timestamp: new Date().toLocaleTimeString(),
      requestHeaders: reqHeaders,
      requestBody: options?.body ? JSON.parse(options.body as string) : undefined,
    });
  }

  try {
    const { silent: _, ...fetchOptions } = options || {};
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const duration = Date.now() - start;
    let responseBody: any;
    
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => resHeaders[k] = v);

    if (!res.ok) {
      try { responseBody = await res.json(); } catch (e) {}
      if (!silent) {
        useDebugStore.getState().updateTransaction(txId, {
          status: res.status,
          responseHeaders: resHeaders,
          responseBody,
          error: responseBody?.error || `HTTP ${res.status}`,
          duration
        });
      }
      const errorMsg = responseBody?.message || responseBody?.error || `HTTP error! status: ${res.status}`;
      const error: any = new Error(errorMsg);
      error.status = res.status;
      throw error;
    }

    responseBody = await res.json();
    if (!silent) {
      useDebugStore.getState().updateTransaction(txId, {
        status: res.status,
        responseHeaders: resHeaders,
        responseBody,
        duration
      });
    }

    return responseBody as T;
  } catch (error: any) {
    if (!silent && !useDebugStore.getState().transactions.find(t => t.id === txId)?.status) {
      useDebugStore.getState().updateTransaction(txId, {
        error: error.message,
        duration: Date.now() - start
      });
    }
    throw error;
  }
};

export const authService = {
  login: (data?: { nickname?: string, avatar?: string, color?: string }) => 
    apiClient<any>('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(data || {}) 
    }),
  getMe: (id: string) => apiClient<any>(`/auth/me/${id}`),
  verify: (id: string) => apiClient<any>(`/auth/verify/${id}`, { silent: true }),
  register: (data: { nickname: string, avatar: string, color: string }) => 
    apiClient<any>('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  updateProfile: (id: string, data: { nickname: string, avatar: string, color: string }) => 
    apiClient<any>('/auth/profile', { 
      method: 'PATCH', 
      body: JSON.stringify({ id, ...data }) 
    }),
};

export const roomService = {
  createRoom: (hostId: string, settings: any) => 
    apiClient<any>('/rooms', {
      method: 'POST',
      body: JSON.stringify({ hostId, settings })
    }),
  getPublicRooms: () => apiClient<any>('/rooms'),
  checkRoom: (code: string) => apiClient<any>(`/rooms/check/${code}`),
  getAllRooms: () => apiClient<any>('/rooms/admin/all', { silent: true }),
  getGameServerStatus: async () => {
    const res = await fetch(`${GAME_SERVER_HTTP}/admin/status`);
    return res.json();
  }
};

export const leaderboardService = {
  getLeaderboard: (roomId: string) => apiClient<any>(`/leaderboard/${roomId}`)
};

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api/v1';
  }
  
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000/api/v1`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  } else {
    const text = await response.text();
    return { success: false, message: `Server trả về lỗi (${response.status}): ${text.slice(0, 100)}` };
  }
}

export async function apiLogin(identifier: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mssv: identifier, password })
    });
    return await handleResponse(response);
  } catch {
    return { success: false, message: `Không thể kết nối đến server (${API_BASE_URL}). Đảm bảo backend đang chạy.` };
  }
}

export async function apiRegister(payload: { mssv: string; password: string; fullName: string; faculty?: string; email?: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(response);
  } catch {
    return { success: false, message: `Không thể kết nối đến server (${API_BASE_URL}).` };
  }
}

export async function apiForgotPassword(identifier: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mssv: identifier })
    });
    return await handleResponse(response);
  } catch {
    return { success: false, message: `Không thể kết nối đến server (${API_BASE_URL}).` };
  }
}

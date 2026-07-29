// ดึงค่า URL จาก .env หรือใช้ Local Server / Remote Server ตามลำดับ
const DEFAULT_LOCAL_URL = 'http://localhost:3079/api';
const DEFAULT_REMOTE_URL = 'http://119.59.102.161:3079/api';

const getBaseUrls = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const urls = [];
  if (envUrl) urls.push(envUrl);
  if (!urls.includes(DEFAULT_LOCAL_URL)) urls.push(DEFAULT_LOCAL_URL);
  if (!urls.includes(DEFAULT_REMOTE_URL)) urls.push(DEFAULT_REMOTE_URL);
  return urls;
};

export const apiCall = async (endpoint: string, options: any = {}) => {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrls = getBaseUrls();
  
  const config: RequestInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  let lastError: any = null;

  for (const baseUrl of baseUrls) {
    try {
      const cacheBuster = `_t=${Date.now()}`;
      const separator = formattedEndpoint.includes('?') ? '&' : '?';
      const fullUrl = `${baseUrl}${formattedEndpoint}${separator}${cacheBuster}`;
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      lastError = error;
    }
  }

  // หากพยายามทุก URL แล้วยังล้มเหลว
  console.warn('⚠️ Could not connect to API server on any configured endpoints.');
  throw lastError || new Error('Failed to connect to backend server. Please make sure node server.js is running.');
};
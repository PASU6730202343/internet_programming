// ดึงค่า URL จาก .env หรือใช้ Local Server ตามลำดับ
const DEFAULT_LOCAL_URL = 'http://localhost:3034/api';

const getBaseUrls = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const urls = [];
  if (envUrl) urls.push(envUrl);
  if (!urls.includes(DEFAULT_LOCAL_URL)) urls.push(DEFAULT_LOCAL_URL);
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

// อัปโหลดไฟล์รูปภาพจริง (multipart/form-data) แล้วได้ URL กลับมาใช้แทนการพิมพ์ URL เอง
export const uploadImage = async (
  file: Blob | { uri: string; name: string; type: string }
): Promise<{ success: boolean; url: string }> => {
  const baseUrls = getBaseUrls();
  let lastError: any = null;

  for (const baseUrl of baseUrls) {
    try {
      const formData = new FormData();
      formData.append('image', file as any);

      const response = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || `HTTP Error Status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;
    }
  }

  throw lastError || new Error('ไม่สามารถอัปโหลดรูปภาพได้');
};
const BASE_URL = 'http://localhost:5000/api'; // Cambiado de 8080 a 5000 (Flask)

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function baseFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;

  // Construct URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error: ${response.status}`);
  }

  // If response is empty (like 204 No Content), return empty object as T
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export default baseFetch;

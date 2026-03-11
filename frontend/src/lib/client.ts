const API_BASE = "http://127.0.0.1:8000/api"

export async function request(path: string, options: RequestInit = {}) {

  const headers: any = {
    Accept: "application/json",
    ...(options.headers || {})
  };

  // only add JSON header if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", text);
    throw new Error("API request failed");
  }

  return res.json();
}

export const client = {
  get: (path: string) => request(path),
  post: (path: string, body: any) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path: string, body: any) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (path: string) =>
    request(path, {
      method: "DELETE",
    }),
}
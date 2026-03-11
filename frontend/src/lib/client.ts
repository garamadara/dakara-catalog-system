const API_BASE = "http://127.0.0.1:8000/api"

export async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(options.headers || {})
    },
    ...options
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("API ERROR:", text)
    throw new Error("API request failed")
  }

  return res.json()
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
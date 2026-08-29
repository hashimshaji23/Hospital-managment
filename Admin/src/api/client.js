const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, { method = "GET", body, isForm = false, skipAuth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (!skipAuth) {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    throw new Error("Could not reach the server. Is it running?");
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export default api;

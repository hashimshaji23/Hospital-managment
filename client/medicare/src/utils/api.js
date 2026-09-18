const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001/api").trim();
const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
const BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

async function request(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export const doctorTokenStore = {
  get: () => localStorage.getItem("doctorToken"),
  set: (t) => localStorage.setItem("doctorToken", t),
  clear: () => localStorage.removeItem("doctorToken"),
};

export const doctorInfoStore = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem("doctorInfo") || "null");
    } catch {
      return null;
    }
  },
  set: (info) => localStorage.setItem("doctorInfo", JSON.stringify(info)),
  clear: () => localStorage.removeItem("doctorInfo"),
};

export default BASE_URL;

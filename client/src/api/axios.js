// This file creates one shared axios instance so we don't repeat
// the backend URL in every single page.

import axios from "axios";

// The backend URL comes from our .env file (see .env.example).
// Vite requires env variables used in the browser to start with VITE_
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Before every request, if we have a login token saved,
// attach it automatically so protected routes work.
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default api;

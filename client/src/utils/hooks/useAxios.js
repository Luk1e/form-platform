import axios from "axios";
import { logout } from "../../toolkit/auth/authSlice";

let store;
export const injectStore = (_store) => {
  store = _store;
};

const BACKEND_URL = "https://form-platform-lilac.vercel.app";
// const BACKEND_URL = "http://localhost:5000";

export const useAxios = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const useAuthAxios = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

useAuthAxios.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

useAuthAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(logout());
    } else {
      return Promise.reject(error);
    }
  }
);

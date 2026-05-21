import axios from "axios";

const storageKeys = {
  token: "keralaBloodConnectToken",
  user: "keralaBloodConnectUser",
  donor: "keralaBloodConnectDonor"
};

const legacyKeys = {
  token: "lifedropToken",
  user: "lifedropUser",
  donor: "lifedropDonor"
};

const readStorage = (key) => localStorage.getItem(storageKeys[key]) || localStorage.getItem(legacyKeys[key]);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = readStorage("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      error.response.data = {
        ...error.response.data,
        message: error.response.data?.message || "Too many requests. Please wait a moment and try again."
      };
    }
    return Promise.reject(error);
  }
);

export const saveSession = ({ token, user, donor }) => {
  localStorage.setItem(storageKeys.token, token);
  localStorage.setItem(storageKeys.user, JSON.stringify(user));
  if (donor) localStorage.setItem(storageKeys.donor, JSON.stringify(donor));
};

export const getUser = () => {
  const raw = readStorage("user");
  return raw ? JSON.parse(raw) : null;
};

export const getDonor = () => {
  const raw = readStorage("donor");
  return raw ? JSON.parse(raw) : null;
};

export const logout = () => {
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  Object.values(legacyKeys).forEach((key) => localStorage.removeItem(key));
};

export default api;

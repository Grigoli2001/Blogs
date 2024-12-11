import axios, { AxiosInstance } from "axios";

const prod = import.meta.env.PROD;

const API_URL = prod
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL;

console.log(API_URL);
console.log(import.meta.env);

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default api;

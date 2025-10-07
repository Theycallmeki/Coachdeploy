import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // matches your backend
  withCredentials: true,            // ✅ send cookies automatically
  headers: { "Content-Type": "application/json" },
});

export default api;

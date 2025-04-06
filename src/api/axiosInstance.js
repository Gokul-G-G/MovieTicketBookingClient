import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNavigate } from "../utils/NavigateHelper";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handling with Toast Notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      toast.error("Session expired!");
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      const navigate = getNavigate()

       if (navigate) {
    setTimeout(() => {
      navigate("/login"); // ✅ No full reload now!
    }, 2000);}
    } else if (status === 500) {
      toast.error("Server Error! Please try again later.");
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;

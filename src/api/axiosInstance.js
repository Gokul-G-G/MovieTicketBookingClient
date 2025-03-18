    import axios from "axios";

    // Create an Axios instance with default settings
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", // Set your API base URL here
      withCredentials: true, // Allow sending cookies with requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    export default api;

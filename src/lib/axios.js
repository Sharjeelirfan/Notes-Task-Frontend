import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-task-backend.vercel.app",
  //   withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `https://notes-task-backend.vercel.app/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Naya access token le kar localStorage me set karo
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Original request headers me naya token set karo
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Original request ko dobara chalao
        return api(originalRequest);
      } catch (refreshError) {
        // Agar refresh token bhi expire ho gaya, to user ko logout karo
        localStorage.removeItem("accessToken");
        window.location.href = "/Login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

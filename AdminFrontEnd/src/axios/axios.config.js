// api.js
import axios from "axios";
// ✅ Create Axios instance
const Axios = axios.create({
  baseURL:"https://buyminute-backend.onrender.com",
  timeout: 10000,
  withCredentials: true, // 🔥 ensures cookies (refreshToken) are sent automatically
});
// ✅ Request interceptor: attach access token
Axios.interceptors.request.use(
    (request) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);
// ✅ Response interceptor: handle token expiration
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const initialRequest = error.config;
        const response = error.response;
        if (!response) return Promise.reject(error);
        const statusCode = response.status;
        const message = response.data.message || "";
        // Check if token expired
        if (
            statusCode === 401 &&
            message.toLowerCase().includes("access token has expired")
        ) {  // Prevent multiple refresh calls
            if (!initialRequest._isTokenRefreshed) {
                initialRequest._isTokenRefreshed = true;
                try {
                    const expiredToken = localStorage.getItem("accessToken");
                    // Call refresh token endpoint
                    const refreshResponse = await Axios.get("/api/refresh-token", {
                        params: {
                            expiredToken
                        },
                    });
                    const newToken = refreshResponse.data.newToken;
                    // Save new token
                    localStorage.setItem("accessToken", newToken);
                    // Update initial request with new token
                    initialRequest.headers.Authorization = `Bearer ${newToken}`;
                    // Retry the original request
                    return Axios(initialRequest);
                } catch (refreshError) {
                    // If refresh fails, logout user
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
export default Axios;
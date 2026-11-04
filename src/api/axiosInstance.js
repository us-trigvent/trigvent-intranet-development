
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://intranet.staging.trigvent.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const storedSession =
    localStorage.getItem("authSession") ||
    sessionStorage.getItem("authSession");

  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      if (session?.token) {
        config.headers.Authorization =
          `${session.tokenType || "Bearer"} ${session.token}`;
      }
    } catch {
      localStorage.removeItem("authSession");
      sessionStorage.removeItem("authSession");
    }
  }

  return config;
});

export default axiosInstance;

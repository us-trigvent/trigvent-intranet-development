
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://intranet.staging.trigvent.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

export default axiosInstance;

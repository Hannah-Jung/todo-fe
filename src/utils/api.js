import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api`,
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + sessionStorage.getItem("token"),
  },
});

api.interceptors.request.use((request) => {
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else {
      return Promise.reject({ message: error.message || "Connection failed" });
    }
  },
);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5182/api/",
});


api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {

    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {

      console.error('Unauthorized access, redirecting...');

    }
    return Promise.reject(error);
  }
);

export { api };
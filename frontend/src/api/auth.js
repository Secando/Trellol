import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Важно для работы с CSRF и cookies
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data) => {
  // Получаем CSRF токен
  await api.get("/sanctum/csrf-cookie");

  // Отправляем запрос на регистрацию
  const response = await api.post("/api/register", data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const login = async (data) => {
  await api.get("/sanctum/csrf-cookie");
  const response = await api.post("/api/login", data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/api/logout");
  } finally {
    localStorage.removeItem("token");
  }
};

export const getUser = async () => {
  const response = await api.get("/api/user");
  return response.data;
};

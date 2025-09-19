import axios from "axios";

// const host = "http://localhost:8080";
const host = process.env.NEXT_PUBLIC_HOST;
console.log("API Host:", host);

// 创建 axios 实例
const api = axios.create({
  baseURL: `${host}/admin`, // 统一前缀
  timeout: 5000,
});

// 请求拦截器：每次请求前自动加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 专门的 login 请求（不加 token）
const login = (username: string, password: string) => {
  return axios.post(`${host}/login`, {
    username,
    password,
  });
};

export { api, login };

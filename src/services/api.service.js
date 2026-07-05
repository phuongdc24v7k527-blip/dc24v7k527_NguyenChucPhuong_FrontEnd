import axios from "axios";
const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default (baseURL) => {
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  });

  // Request Interceptor: Tự động gửi vai trò và tên người dùng trong headers
  instance.interceptors.request.use(
    (config) => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        config.headers["x-user-role"] = user.role || "user";
        config.headers["x-username"] = user.username || "";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

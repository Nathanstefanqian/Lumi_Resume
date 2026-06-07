import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '', // 使用相对路径，配合 vite proxy
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lumi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 适配 NestJS 统一响应格式：{ code, data, message }
    // 如果返回的是二进制数据（如 PDF 导出），直接返回 response
    if (response.config.responseType === 'blob' || response.headers['content-type'] === 'application/pdf') {
      return response;
    }

    const res = response.data;
    
    // 如果是标准包装格式，提取内部 data
    if (res && typeof res === 'object' && 'code' in res && 'data' in res) {
      if (res.code === 200 || res.code === 201) {
        return res.data;
      }
      // 业务错误处理
      const errorMsg = res.message || '请求失败';
      return Promise.reject(new Error(errorMsg));
    }

    // 如果不是标准包装格式，直接返回 data
    return res;
  },
  (error) => {
    // HTTP 错误处理
    if (error.response && error.response.status === 401) {
      // 自动登出逻辑由 App.jsx 处理
    }
    return Promise.reject(error);
  }
);

export default request;

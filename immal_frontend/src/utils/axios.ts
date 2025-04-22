import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import store from "../store";
import authSlice from "../store/slices/auth";

const axiosService = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosService.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const refreshAuthLogic = async (failedRequest: any) => {
  const refreshToken = store.getState().auth.refreshToken;
  if (refreshToken) {
    const res = await axios.post("/auth/refresh/", { refresh: refreshToken }, { baseURL: process.env.REACT_APP_API_URL });
    store.dispatch(authSlice.actions.setAuthTokens({ token: res.data.access, refreshToken: res.data.refresh }));
    failedRequest.response.config.headers.Authorization = `Bearer ${res.data.access}`;
  }
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher<T = any>(url: string) {
    return axiosService.get<T>(url).then((res) => res.data);
  }
  

export default axiosService;

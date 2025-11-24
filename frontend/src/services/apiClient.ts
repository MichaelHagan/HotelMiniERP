import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '../config';

export class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = config.api.url) {
    this.baseURL = baseURL;
    console.log('ApiClient initialized with baseURL:', baseURL);
    console.log('Config API URL:', config.api.url);
    this.instance = axios.create({
      baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (axiosConfig) => {
        const token = localStorage.getItem(config.auth.tokenKey);
        const tokenExpiryKey = 'hotelminierp_token_expiry';
        const expiryStr = localStorage.getItem(tokenExpiryKey);
        
        // Check if token is expired before adding to request
        if (token && expiryStr) {
          const expiry = parseInt(expiryStr, 10);
          const now = Math.floor(Date.now() / 1000);
          const isExpired = now >= (expiry - 60); // 60 second buffer
          
          if (!isExpired) {
            axiosConfig.headers.Authorization = `Bearer ${token}`;
          } else {
            // Token expired, clear it and reject the request
            console.log('Token expired in request interceptor');
            localStorage.removeItem(config.auth.tokenKey);
            localStorage.removeItem(config.auth.userKey);
            localStorage.removeItem(tokenExpiryKey);
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
          }
        }
        
        return axiosConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.userKey);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public setBaseURL(url: string): void {
    this.baseURL = url;
    this.instance.defaults.baseURL = url;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiClient = new ApiClient();
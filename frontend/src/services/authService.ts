import { apiClient } from './apiClient';
import config from '../config';
import { 
  AuthResponse, 
  LoginDto, 
  ChangePasswordDto,
  User 
} from '../types';

interface TokenPayload {
  exp: number;
  UserId: string;
  [key: string]: any;
}

export class AuthService {
  private readonly basePath = '/auth';
  private readonly tokenExpiryKey = 'hotelminierp_token_expiry';

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/login`, loginDto);
    
    // Store token and user data with expiry
    if (response.token) {
      this.storeToken(response.token);
      localStorage.setItem(config.auth.userKey, JSON.stringify(response.user));
    }
    
    return response;
  }

  private storeToken(token: string): void {
    localStorage.setItem(config.auth.tokenKey, token);
    
    // Extract and store expiry time from token
    const payload = this.decodeToken(token);
    if (payload?.exp) {
      localStorage.setItem(this.tokenExpiryKey, payload.exp.toString());
    }
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    await apiClient.post(`${this.basePath}/change-password`, changePasswordDto);
  }

  logout(): void {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userKey);
    localStorage.removeItem(this.tokenExpiryKey);
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(config.auth.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    const token = localStorage.getItem(config.auth.tokenKey);
    
    // Check if token exists and is not expired
    if (token && this.isTokenExpired()) {
      console.log('Token expired, clearing storage');
      this.logout();
      return null;
    }
    
    return token;
  }

  isTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryStr) {
      return true; // No expiry means invalid token
    }

    const expiry = parseInt(expiryStr, 10);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    
    // Add 60 second buffer to account for clock skew
    return now >= (expiry - 60);
  }

  getTokenExpiryTime(): Date | null {
    const expiryStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryStr) {
      return null;
    }

    const expiry = parseInt(expiryStr, 10);
    return new Date(expiry * 1000);
  }

  getTimeUntilExpiry(): number {
    const expiryStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryStr) {
      return 0;
    }

    const expiry = parseInt(expiryStr, 10);
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, expiry - now);
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token && !this.isTokenExpired();
  }
}

export const authService = new AuthService();
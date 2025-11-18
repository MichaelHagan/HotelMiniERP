import { apiClient } from './apiClient';
import config from '../config';
import { 
  AuthResponse, 
  LoginDto, 
  ChangePasswordDto,
  User 
} from '../types';

export class AuthService {
  private readonly basePath = '/auth';

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/login`, loginDto);
    
    // Store token and user data
    if (response.token) {
      localStorage.setItem(config.auth.tokenKey, response.token);
      localStorage.setItem(config.auth.userKey, JSON.stringify(response.user));
    }
    
    return response;
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
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(config.auth.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem(config.auth.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();
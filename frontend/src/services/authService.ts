import { apiClient } from './apiClient';
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
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();
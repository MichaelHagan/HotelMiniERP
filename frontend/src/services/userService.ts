import { apiClient } from './apiClient';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
  PaginationParams
} from '../types';

export class UserService {
  private readonly basePath = '/users';

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<User>>(this.basePath);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<User>>(url);
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${id}`);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    return apiClient.post<User>(this.basePath, userDto);
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    return apiClient.put<User>(`${this.basePath}/${id}`, userDto);
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return apiClient.get<User[]>(`${this.basePath}/role/${role}`);
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    return apiClient.get<User[]>(`${this.basePath}/department/${encodeURIComponent(department)}`);
  }

  async getActiveUsers(): Promise<User[]> {
    return apiClient.get<User[]>(`${this.basePath}/active`);
  }

  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    address?: string;
  }): Promise<User> {
    return apiClient.put<User>(`${this.basePath}/me`, profileData);
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`${this.basePath}/me/password`, passwordData);
  }
}

export const userService = new UserService();
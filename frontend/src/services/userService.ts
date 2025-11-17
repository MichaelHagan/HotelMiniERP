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
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
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
}

export const userService = new UserService();
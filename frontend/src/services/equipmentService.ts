import { apiClient } from './apiClient';
import {
  Equipment,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentQueryParams,
  PaginatedResponse
} from '../types';

export class EquipmentService {
  private readonly basePath = '/equipment';

  async getEquipment(params?: EquipmentQueryParams): Promise<PaginatedResponse<Equipment>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Equipment>>(url);
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    return apiClient.get<Equipment>(`${this.basePath}/${id}`);
  }

  async createEquipment(equipmentDto: CreateEquipmentDto): Promise<Equipment> {
    return apiClient.post<Equipment>(this.basePath, equipmentDto);
  }

  async updateEquipment(id: string, equipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    return apiClient.put<Equipment>(`${this.basePath}/${id}`, equipmentDto);
  }

  async deleteEquipment(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getEquipmentByCategory(category: string): Promise<Equipment[]> {
    return apiClient.get<Equipment[]>(`${this.basePath}/category/${category}`);
  }

  async getEquipmentByLocation(location: string): Promise<Equipment[]> {
    return apiClient.get<Equipment[]>(`${this.basePath}/location/${encodeURIComponent(location)}`);
  }

  async getMaintenanceDue(): Promise<Equipment[]> {
    return apiClient.get<Equipment[]>(`${this.basePath}/maintenance-due`);
  }

  async updateOperatingHours(id: string, hours: number): Promise<Equipment> {
    return apiClient.put<Equipment>(`${this.basePath}/${id}/operating-hours`, { operatingHours: hours });
  }
}

export const equipmentService = new EquipmentService();
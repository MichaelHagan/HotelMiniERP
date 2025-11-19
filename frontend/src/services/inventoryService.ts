import { apiClient } from './apiClient';
import {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryParams,
  PaginatedResponse
} from '../types';

export class InventoryService {
  private readonly basePath = '/inventory';

  async getInventory(params?: InventoryQueryParams): Promise<PaginatedResponse<Inventory>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<Inventory>>(this.basePath);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Inventory>>(url);
  }

  async getInventoryById(id: string): Promise<Inventory> {
    return apiClient.get<Inventory>(`${this.basePath}/${id}`);
  }

  async createInventory(inventoryDto: CreateInventoryDto): Promise<Inventory> {
    return apiClient.post<Inventory>(this.basePath, inventoryDto);
  }

  async updateInventory(id: string, inventoryDto: UpdateInventoryDto): Promise<Inventory> {
    return apiClient.put<Inventory>(`${this.basePath}/${id}`, inventoryDto);
  }

  async deleteInventory(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getEquipmentByCategory(category: string): Promise<Inventory[]> {
    return apiClient.get<Inventory[]>(`${this.basePath}/category/${category}`);
  }

  async getEquipmentByLocation(location: string): Promise<Inventory[]> {
    return apiClient.get<Inventory[]>(`${this.basePath}/location/${encodeURIComponent(location)}`);
  }

  async getMaintenanceDue(): Promise<Inventory[]> {
    return apiClient.get<Inventory[]>(`${this.basePath}/maintenance-due`);
  }

  async updateOperatingHours(id: string, hours: number): Promise<Inventory> {
    return apiClient.put<Inventory>(`${this.basePath}/${id}/operating-hours`, { operatingHours: hours });
  }
}

export const inventoryService = new InventoryService();
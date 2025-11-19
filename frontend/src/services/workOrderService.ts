import { apiClient } from './apiClient';
import {
  WorkOrder,
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
  WorkOrderQueryParams,
  PaginatedResponse
} from '../types';

export class WorkOrderService {
  private readonly basePath = '/workorders';

  async getWorkOrders(params?: WorkOrderQueryParams): Promise<PaginatedResponse<WorkOrder>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<WorkOrder>>(this.basePath);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<WorkOrder>>(url);
  }

  async getWorkOrderById(id: string): Promise<WorkOrder> {
    return apiClient.get<WorkOrder>(`${this.basePath}/${id}`);
  }

  async createWorkOrder(workOrderDto: CreateWorkOrderDto): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>(this.basePath, workOrderDto);
  }

  async updateWorkOrder(id: string, workOrderDto: UpdateWorkOrderDto): Promise<WorkOrder> {
    return apiClient.put<WorkOrder>(`${this.basePath}/${id}`, workOrderDto);
  }

  async deleteWorkOrder(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getMyWorkOrders(): Promise<WorkOrder[]> {
    return apiClient.get<WorkOrder[]>(`${this.basePath}/my-workorders`);
  }

  async assignWorkOrder(id: string, userId: string): Promise<WorkOrder> {
    return apiClient.put<WorkOrder>(`${this.basePath}/${id}/assign`, { assignedUserId: userId });
  }

  async completeWorkOrder(id: string, notes?: string, actualHours?: number): Promise<WorkOrder> {
    return apiClient.put<WorkOrder>(`${this.basePath}/${id}/complete`, { notes, actualHours });
  }
}

export const workOrderService = new WorkOrderService();
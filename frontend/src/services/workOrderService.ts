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
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
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
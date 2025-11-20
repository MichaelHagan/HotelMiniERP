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
    // Convert string IDs to numbers for backend compatibility
    const payload = {
      ...workOrderDto,
      assetId: workOrderDto.assetId ? parseInt(workOrderDto.assetId, 10) : undefined,
      assignedToUserId: workOrderDto.assignedToUserId ? parseInt(workOrderDto.assignedToUserId, 10) : undefined,
      requestedByUserId: workOrderDto.requestedByUserId ? parseInt(workOrderDto.requestedByUserId, 10) : undefined,
      workerComplaintId: workOrderDto.workerComplaintId ? parseInt(workOrderDto.workerComplaintId, 10) : undefined,
      customerComplaintId: workOrderDto.customerComplaintId ? parseInt(workOrderDto.customerComplaintId, 10) : undefined,
    };
    return apiClient.post<WorkOrder>(this.basePath, payload);
  }

  async updateWorkOrder(id: string, workOrderDto: UpdateWorkOrderDto): Promise<WorkOrder> {
    // Backend expects these fields to always be present for updates
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
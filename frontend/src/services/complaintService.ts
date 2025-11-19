import { apiClient } from './apiClient';
import {
  WorkerComplaint,
  CustomerComplaint,
  CreateWorkerComplaintDto,
  CreateCustomerComplaintDto,
  UpdateComplaintDto,
  ComplaintQueryParams,
  PaginatedResponse
} from '../types';

export class ComplaintService {
  private readonly basePath = '/complaints';

  // Worker Complaints
  async getWorkerComplaints(params?: ComplaintQueryParams): Promise<PaginatedResponse<WorkerComplaint>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<WorkerComplaint>>(`${this.basePath}/worker`);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}/worker?${queryString}` : `${this.basePath}/worker`;
    return apiClient.get<PaginatedResponse<WorkerComplaint>>(url);
  }

  async getWorkerComplaintById(id: string): Promise<WorkerComplaint> {
    return apiClient.get<WorkerComplaint>(`${this.basePath}/worker/${id}`);
  }

  async createWorkerComplaint(complaintDto: CreateWorkerComplaintDto): Promise<WorkerComplaint> {
    return apiClient.post<WorkerComplaint>(`${this.basePath}/worker`, complaintDto);
  }

  async updateWorkerComplaint(id: string, complaintDto: UpdateComplaintDto): Promise<WorkerComplaint> {
    return apiClient.put<WorkerComplaint>(`${this.basePath}/worker/${id}`, complaintDto);
  }

  async deleteWorkerComplaint(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/worker/${id}`);
  }

  async getMyWorkerComplaints(): Promise<WorkerComplaint[]> {
    return apiClient.get<WorkerComplaint[]>(`${this.basePath}/worker/my-complaints`);
  }

  // Customer Complaints
  async getCustomerComplaints(params?: ComplaintQueryParams): Promise<PaginatedResponse<CustomerComplaint>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<CustomerComplaint>>(`${this.basePath}/customer`);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}/customer?${queryString}` : `${this.basePath}/customer`;
    return apiClient.get<PaginatedResponse<CustomerComplaint>>(url);
  }

  async getCustomerComplaintById(id: string): Promise<CustomerComplaint> {
    return apiClient.get<CustomerComplaint>(`${this.basePath}/customer/${id}`);
  }

  async createCustomerComplaint(complaintDto: CreateCustomerComplaintDto): Promise<CustomerComplaint> {
    return apiClient.post<CustomerComplaint>(`${this.basePath}/customer`, complaintDto);
  }

  async updateCustomerComplaint(id: string, complaintDto: UpdateComplaintDto): Promise<CustomerComplaint> {
    return apiClient.put<CustomerComplaint>(`${this.basePath}/customer/${id}`, complaintDto);
  }

  async deleteCustomerComplaint(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/customer/${id}`);
  }

  async assignComplaint(type: 'worker' | 'customer', id: string, userId: string): Promise<WorkerComplaint | CustomerComplaint> {
    return apiClient.put(`${this.basePath}/${type}/${id}/assign`, { assignedUserId: userId });
  }

  async resolveComplaint(type: 'worker' | 'customer', id: string, resolutionNotes: string): Promise<WorkerComplaint | CustomerComplaint> {
    return apiClient.put(`${this.basePath}/${type}/${id}/resolve`, { resolutionNotes });
  }
}

export const complaintService = new ComplaintService();
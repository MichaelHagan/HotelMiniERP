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
    const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    // Add type parameter for worker complaints
    filteredParams.type = 'worker';
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : `${this.basePath}?type=worker`;
    return apiClient.get<PaginatedResponse<WorkerComplaint>>(url);
  }

  async getWorkerComplaintById(id: string): Promise<WorkerComplaint> {
    return apiClient.get<WorkerComplaint>(`${this.basePath}/worker/${id}`);
  }

  async createWorkerComplaint(complaintDto: CreateWorkerComplaintDto): Promise<WorkerComplaint> {
    return apiClient.post<WorkerComplaint>(`${this.basePath}`, { ...complaintDto, type: 'worker' });
  }

  async updateWorkerComplaint(id: string, complaintDto: UpdateComplaintDto): Promise<WorkerComplaint> {
    return apiClient.put<WorkerComplaint>(`${this.basePath}/worker/${id}`, { ...complaintDto, type: 'worker' });
  }

  async deleteWorkerComplaint(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/worker/${id}`);
  }

  async getMyWorkerComplaints(): Promise<WorkerComplaint[]> {
    return apiClient.get<WorkerComplaint[]>(`${this.basePath}/worker/my-complaints`);
  }

  // Customer Complaints
  async getCustomerComplaints(params?: ComplaintQueryParams): Promise<PaginatedResponse<CustomerComplaint>> {
    const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    // Add type parameter for customer complaints
    filteredParams.type = 'customer';
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : `${this.basePath}?type=customer`;
    return apiClient.get<PaginatedResponse<CustomerComplaint>>(url);
  }

  async getCustomerComplaintById(id: string): Promise<CustomerComplaint> {
    return apiClient.get<CustomerComplaint>(`${this.basePath}/customer/${id}`);
  }

  async createCustomerComplaint(complaintDto: CreateCustomerComplaintDto): Promise<CustomerComplaint> {
    return apiClient.post<CustomerComplaint>(`${this.basePath}`, { ...complaintDto, type: 'customer' });
  }

  async updateCustomerComplaint(id: string, complaintDto: UpdateComplaintDto): Promise<CustomerComplaint> {
    return apiClient.put<CustomerComplaint>(`${this.basePath}/customer/${id}`, { ...complaintDto, type: 'customer' });
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
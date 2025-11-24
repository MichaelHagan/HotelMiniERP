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

  async getWorkerComplaintById(id: number): Promise<WorkerComplaint> {
    return apiClient.get<WorkerComplaint>(`${this.basePath}/worker/${id}`);
  }

  async createWorkerComplaint(complaintDto: CreateWorkerComplaintDto, images?: File[]): Promise<WorkerComplaint> {
    const formData = new FormData();
    formData.append('type', 'worker');
    formData.append('title', complaintDto.title);
    formData.append('description', complaintDto.description);
    formData.append('category', complaintDto.category);
    formData.append('priority', complaintDto.priority.toString());
    formData.append('submittedByUserId', complaintDto.submittedByUserId.toString());
    
    if (complaintDto.location) {
      formData.append('location', complaintDto.location);
    }
    
    if (complaintDto.notes) {
      formData.append('notes', complaintDto.notes);
    }
    
    // Append image files
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }
    
    return apiClient.post<WorkerComplaint>(`${this.basePath}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async updateWorkerComplaint(id: number, complaintDto: UpdateComplaintDto): Promise<WorkerComplaint> {
    return apiClient.put<WorkerComplaint>(`${this.basePath}/worker/${id}`, { ...complaintDto, id, type: 'worker' });
  }

  async deleteWorkerComplaint(id: number): Promise<void> {
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

  async getCustomerComplaintById(id: number): Promise<CustomerComplaint> {
    return apiClient.get<CustomerComplaint>(`${this.basePath}/customer/${id}`);
  }

  async createCustomerComplaint(complaintDto: CreateCustomerComplaintDto, images?: File[]): Promise<CustomerComplaint> {
    const formData = new FormData();
    formData.append('type', 'customer');
    formData.append('title', complaintDto.title);
    formData.append('description', complaintDto.description);
    formData.append('category', complaintDto.category);
    formData.append('priority', complaintDto.priority.toString());
    formData.append('customerName', complaintDto.customerName);
    formData.append('customerEmail', complaintDto.customerEmail);
    
    if (complaintDto.customerPhone) {
      formData.append('customerPhone', complaintDto.customerPhone);
    }
    
    if (complaintDto.roomNumber) {
      formData.append('roomNumber', complaintDto.roomNumber);
    }
    
    if (complaintDto.location) {
      formData.append('location', complaintDto.location);
    }
    
    if (complaintDto.notes) {
      formData.append('notes', complaintDto.notes);
    }
    
    // Append image files
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }
    
    return apiClient.post<CustomerComplaint>(`${this.basePath}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async updateCustomerComplaint(id: number, complaintDto: UpdateComplaintDto): Promise<CustomerComplaint> {
    return apiClient.put<CustomerComplaint>(`${this.basePath}/customer/${id}`, { ...complaintDto, id, type: 'customer' });
  }

  async deleteCustomerComplaint(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/customer/${id}`);
  }

  async assignComplaint(type: 'worker' | 'customer', id: number, userId: string): Promise<WorkerComplaint | CustomerComplaint> {
    return apiClient.put(`${this.basePath}/${type}/${id}/assign`, { assignedUserId: userId });
  }

  async resolveComplaint(type: 'worker' | 'customer', id: number, resolutionNotes: string): Promise<WorkerComplaint | CustomerComplaint> {
    return apiClient.put(`${this.basePath}/${type}/${id}/resolve`, { resolutionNotes });
  }
}

export const complaintService = new ComplaintService();
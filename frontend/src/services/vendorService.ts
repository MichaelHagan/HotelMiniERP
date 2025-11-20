import { Vendor, CreateVendorDto, UpdateVendorDto } from '../types';
import { apiClient } from './apiClient';

class VendorService {
  private basePath = '/vendors';

  async getVendors(isActive?: boolean): Promise<Vendor[]> {
    const params = isActive !== undefined ? { isActive } : {};
    return apiClient.get<Vendor[]>(this.basePath, { params });
  }

  async getVendor(id: string): Promise<Vendor> {
    return apiClient.get<Vendor>(`${this.basePath}/${id}`);
  }

  async createVendor(vendor: CreateVendorDto): Promise<Vendor> {
    return apiClient.post<Vendor>(this.basePath, vendor);
  }

  async updateVendor(id: string, vendor: UpdateVendorDto): Promise<Vendor> {
    return apiClient.put<Vendor>(`${this.basePath}/${id}`, vendor);
  }

  async deleteVendor(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const vendorService = new VendorService();

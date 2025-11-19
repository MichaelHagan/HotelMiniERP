import { apiClient } from './apiClient';
import {
  Procedure,
  CreateProcedureDto,
  UpdateProcedureDto,
  PaginatedResponse,
  ProcedureQueryParams
} from '../types';

export class ProcedureService {
  private readonly basePath = '/procedures';

  async getProcedures(params?: ProcedureQueryParams): Promise<PaginatedResponse<Procedure>> {
    if (!params) {
      return apiClient.get<PaginatedResponse<Procedure>>(this.basePath);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Procedure>>(url);
  }

  async getProcedureById(id: string): Promise<Procedure> {
    return apiClient.get<Procedure>(`${this.basePath}/${id}`);
  }

  async createProcedure(procedureDto: CreateProcedureDto): Promise<Procedure> {
    return apiClient.post<Procedure>(this.basePath, procedureDto);
  }

  async updateProcedure(id: string, procedureDto: UpdateProcedureDto): Promise<Procedure> {
    return apiClient.put<Procedure>(`${this.basePath}/${id}`, procedureDto);
  }

  async deleteProcedure(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getProceduresByCategory(category: string): Promise<Procedure[]> {
    return apiClient.get<Procedure[]>(`${this.basePath}/category/${category}`);
  }

  async getActiveProcedures(): Promise<Procedure[]> {
    return apiClient.get<Procedure[]>(`${this.basePath}/active`);
  }

  async searchProcedures(searchTerm: string): Promise<Procedure[]> {
    return apiClient.get<Procedure[]>(`${this.basePath}/search?term=${encodeURIComponent(searchTerm)}`);
  }
}

export const procedureService = new ProcedureService();
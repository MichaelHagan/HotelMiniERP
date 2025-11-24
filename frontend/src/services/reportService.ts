import { apiClient } from './apiClient';
import {
  AssetReport,
  WorkOrderReport,
  DashboardSummaryDto
} from '../types';

export class ReportService {
  private readonly basePath = '/reports';

  async getDashboardSummary(): Promise<DashboardSummaryDto> {
    return apiClient.get(`${this.basePath}/dashboard`);
  }

  async getAssetReport(): Promise<AssetReport> {
    return apiClient.get<AssetReport>(`${this.basePath}/assets`);
  }

  async getWorkOrderReport(): Promise<WorkOrderReport> {
    return apiClient.get<WorkOrderReport>(`${this.basePath}/workorders`);
  }

  async getWorkOrderPerformanceReport(startDate: string, endDate: string): Promise<any> {
    return apiClient.get(`${this.basePath}/workorders/performance?startDate=${startDate}&endDate=${endDate}`);
  }

  async getAssetUtilizationReport(): Promise<any> {
    return apiClient.get(`${this.basePath}/asset-utilization`);
  }

  async getMaintenanceReport(): Promise<any> {
    return apiClient.get(`${this.basePath}/maintenance`);
  }

  async getComplaintReport(): Promise<any> {
    return apiClient.get(`${this.basePath}/complaints`);
  }

  async getUserActivityReport(): Promise<any> {
    return apiClient.get(`${this.basePath}/user-activity`);
  }

  async getCustomReport(reportType: string, params?: Record<string, any>): Promise<any> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${this.basePath}/custom/${reportType}?${queryString}` : `${this.basePath}/custom/${reportType}`;
    return apiClient.get(url);
  }
}

export const reportService = new ReportService();
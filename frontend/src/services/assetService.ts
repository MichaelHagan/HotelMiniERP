import { apiClient } from './apiClient';
import {
  Asset,
  CreateAssetDto,
  UpdateAssetDto,
  AssetQueryParams,
  PaginatedResponse
} from '../types';

export class AssetService {
  private readonly basePath = '/assets';

  async getAssets(params?: AssetQueryParams): Promise<PaginatedResponse<Asset>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Asset>>(url);
  }

  async getAssetById(id: string): Promise<Asset> {
    return apiClient.get<Asset>(`${this.basePath}/${id}`);
  }

  async createAsset(assetDto: CreateAssetDto): Promise<Asset> {
    return apiClient.post<Asset>(this.basePath, assetDto);
  }

  async updateAsset(id: string, assetDto: UpdateAssetDto): Promise<Asset> {
    return apiClient.put<Asset>(`${this.basePath}/${id}`, assetDto);
  }

  async deleteAsset(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getAssetsByCategory(category: string): Promise<Asset[]> {
    return apiClient.get<Asset[]>(`${this.basePath}/category/${category}`);
  }

  async getAssetsByLocation(location: string): Promise<Asset[]> {
    return apiClient.get<Asset[]>(`${this.basePath}/location/${encodeURIComponent(location)}`);
  }

  async getAssetsRequiringMaintenance(): Promise<Asset[]> {
    return apiClient.get<Asset[]>(`${this.basePath}/maintenance-required`);
  }
}

export const assetService = new AssetService();
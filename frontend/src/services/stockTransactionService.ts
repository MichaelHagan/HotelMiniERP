import { apiClient } from './apiClient';
import { StockTransaction, CreateStockTransactionDto } from '../types';

export const stockTransactionService = {
  createTransaction: async (dto: CreateStockTransactionDto): Promise<StockTransaction> => {
    return apiClient.post<StockTransaction>('/stocktransactions', dto);
  },

  getTransactionsByInventoryId: async (inventoryId: number): Promise<StockTransaction[]> => {
    return apiClient.get<StockTransaction[]>(`/stocktransactions/inventory/${inventoryId}`);
  }
};

import axios from 'axios';
import { StockTransaction, CreateStockTransactionDto } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5057/api';

export const stockTransactionService = {
  createTransaction: async (dto: CreateStockTransactionDto): Promise<StockTransaction> => {
    const response = await axios.post(`${API_URL}/stocktransactions`, dto);
    return response.data;
  },

  getTransactionsByInventoryId: async (inventoryId: number): Promise<StockTransaction[]> => {
    const response = await axios.get(`${API_URL}/stocktransactions/inventory/${inventoryId}`);
    return response.data;
  }
};

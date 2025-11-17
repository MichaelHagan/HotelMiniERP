import { apiClient } from './apiClient';
import {
  Message,
  CreateMessageDto,
  UpdateMessageDto,
  PaginatedResponse,
  PaginationParams
} from '../types';

export class MessageService {
  private readonly basePath = '/messages';

  async getMessages(params?: PaginationParams): Promise<PaginatedResponse<Message>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Message>>(url);
  }

  async getMessageById(id: string): Promise<Message> {
    return apiClient.get<Message>(`${this.basePath}/${id}`);
  }

  async sendMessage(messageDto: CreateMessageDto): Promise<Message> {
    return apiClient.post<Message>(this.basePath, messageDto);
  }

  async updateMessage(id: string, messageDto: UpdateMessageDto): Promise<Message> {
    return apiClient.put<Message>(`${this.basePath}/${id}`, messageDto);
  }

  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async getUnreadMessages(): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.basePath}/unread`);
  }

  async markAsRead(id: string): Promise<Message> {
    return apiClient.put<Message>(`${this.basePath}/${id}/mark-read`);
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.put(`${this.basePath}/mark-all-read`);
  }

  async getBroadcastMessages(): Promise<Message[]> {
    return apiClient.get<Message[]>(`${this.basePath}/broadcast`);
  }
}

export const messageService = new MessageService();
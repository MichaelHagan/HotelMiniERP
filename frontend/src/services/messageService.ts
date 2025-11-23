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
    if (!params) {
      return apiClient.get<PaginatedResponse<Message>>(this.basePath);
    }
    
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<Message>>(url);
  }

  async getMessageById(id: string): Promise<Message> {
    return apiClient.get<Message>(`${this.basePath}/${id}`);
  }

  async sendMessage(messageDto: CreateMessageDto): Promise<Message> {
    const backendPayload = {
      type: messageDto.messageType,
      title: messageDto.subject,
      content: messageDto.content,
      sentToUserId: messageDto.receiverId ? parseInt(messageDto.receiverId) : null
    };
    
    return apiClient.post<Message>(this.basePath, backendPayload);
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
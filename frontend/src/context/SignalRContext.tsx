import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from './AuthContext';
import { Message } from '../types';

interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
  joinGroup: (groupName: string) => Promise<void>;
  leaveGroup: (groupName: string) => Promise<void>;
  sendMessage: (message: string, recipientId?: string) => Promise<void>;
  sendBroadcast: (message: string) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};

interface SignalRProviderProps {
  children: ReactNode;
  onMessageReceived?: (message: Message) => void;
  onNotificationReceived?: (notification: any) => void;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ 
  children, 
  onMessageReceived,
  onNotificationReceived 
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5253/messagehub', {
          accessTokenFactory: () => localStorage.getItem('authToken') || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      newConnection.on('MessageReceived', (message: Message) => {
        console.log('Message received:', message);
        onMessageReceived?.(message);
      });

      newConnection.on('NotificationReceived', (notification: any) => {
        console.log('Notification received:', notification);
        onNotificationReceived?.(notification);
      });

      newConnection.on('UserConnected', (userId: string) => {
        console.log(`User ${userId} connected`);
      });

      newConnection.on('UserDisconnected', (userId: string) => {
        console.log(`User ${userId} disconnected`);
      });

      // Start the connection
      newConnection
        .start()
        .then(() => {
          console.log('SignalR connected');
          setIsConnected(true);
        })
        .catch((error) => {
          console.error('SignalR connection error:', error);
          setIsConnected(false);
        });

      // Handle connection state changes
      newConnection.onreconnecting(() => {
        console.log('SignalR reconnecting...');
        setIsConnected(false);
      });

      newConnection.onreconnected(() => {
        console.log('SignalR reconnected');
        setIsConnected(true);
      });

      newConnection.onclose(() => {
        console.log('SignalR disconnected');
        setIsConnected(false);
      });

      setConnection(newConnection);

      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
    } else {
      // Clean up connection if user is not authenticated
      if (connection) {
        connection.stop();
        setConnection(null);
        setIsConnected(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const joinGroup = async (groupName: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('JoinGroup', groupName);
        console.log(`Joined group: ${groupName}`);
      } catch (error) {
        console.error(`Failed to join group ${groupName}:`, error);
      }
    }
  };

  const leaveGroup = async (groupName: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('LeaveGroup', groupName);
        console.log(`Left group: ${groupName}`);
      } catch (error) {
        console.error(`Failed to leave group ${groupName}:`, error);
      }
    }
  };

  const sendMessage = async (message: string, recipientId?: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('SendMessage', message, recipientId);
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection not available');
    }
  };

  const sendBroadcast = async (message: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('SendBroadcast', message);
      } catch (error) {
        console.error('Failed to send broadcast:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection not available');
    }
  };

  const value: SignalRContextType = {
    connection,
    isConnected,
    joinGroup,
    leaveGroup,
    sendMessage,
    sendBroadcast,
  };

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
};
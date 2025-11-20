import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { userService } from '../../services/userService';
import { CreateMessageDto, MessageType, Message } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSignalR } from '../../context/SignalRContext';
import { formatDateTime } from '../../utils/dateUtils';

interface ConversationViewProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  open,
  onClose,
  userId
}) => {
  const { user } = useAuth();
  const { connection, isConnected } = useSignalR();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messageContent, setMessageContent] = useState('');
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);

  // Fetch other user details
  const { data: otherUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId && open
  });

  // Fetch all messages and filter for conversation
  const { data: messagesData } = useQuery({
    queryKey: ['messages'],
    queryFn: () => messageService.getMessages({ page: 1, pageSize: 1000 }),
    enabled: open && !!userId,
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  useEffect(() => {
    if (messagesData?.data && userId) {
      // Filter messages for this conversation
      const filtered = messagesData.data.filter(
        (msg) =>
          (msg.senderId === Number(user?.id) && msg.receiverId === Number(userId)) ||
          (msg.senderId === Number(userId) && msg.receiverId === Number(user?.id))
      );
      setConversationMessages(filtered.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    }
  }, [messagesData, userId, user]);

  // Set up SignalR listener for new messages
  useEffect(() => {
    if (connection && isConnected && open) {
      const handleMessageReceived = (message: Message) => {
        // Only add message if it's part of this conversation
        if (
          (message.senderId === Number(user?.id) && message.receiverId === Number(userId)) ||
          (message.senderId === Number(userId) && message.receiverId === Number(user?.id))
        ) {
          setConversationMessages(prev => [...prev, message]);
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      };

      connection.on('MessageReceived', handleMessageReceived);

      return () => {
        connection.off('MessageReceived', handleMessageReceived);
      };
    }
  }, [connection, isConnected, open, userId, user, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const sendMutation = useMutation({
    mutationFn: (data: CreateMessageDto) => messageService.sendMessage(data),
    onSuccess: (message) => {
      setConversationMessages(prev => [...prev, message]);
      setMessageContent('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const handleSendMessage = () => {
    if (!messageContent.trim() || !userId) return;

    const messageDto: CreateMessageDto = {
      subject: 'Conversation',
      content: messageContent,
      messageType: MessageType.Personal,
      receiverId: userId
    };

    sendMutation.mutate(messageDto);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!userId || !otherUser) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { height: '80vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{otherUser.firstName[0]}{otherUser.lastName[0]}</Avatar>
          <Box>
            <Typography variant="h6">
              {otherUser.firstName} {otherUser.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {otherUser.role} - {otherUser.department || 'No Department'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {conversationMessages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {conversationMessages.map((message) => {
              const isOwnMessage = message.senderId === Number(user?.id);
              
              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                      color: isOwnMessage ? 'primary.contrastText' : 'text.primary'
                    }}
                  >
                    {message.subject && (
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.5,
                          color: isOwnMessage ? 'inherit' : 'text.primary'
                        }}
                      >
                        {message.subject}
                      </Typography>
                    )}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        color: isOwnMessage ? 'inherit' : 'text.primary'
                      }}
                    >
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 1,
                        color: isOwnMessage ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                      }}
                    >
                      {formatDateTime(message.createdAt)}
                      {message.isRead && isOwnMessage && ' • Read'}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type a message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || sendMutation.isPending}
            sx={{ minWidth: 100 }}
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

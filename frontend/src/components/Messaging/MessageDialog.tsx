import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  Autocomplete
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { userService } from '../../services/userService';
import { CreateMessageDto, MessageType, User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSignalR } from '../../context/SignalRContext';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  recipientId?: string;
}

export const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onClose,
  recipientId
}) => {
  const { user } = useAuth();
  const { sendMessage: sendSignalRMessage, sendBroadcast } = useSignalR();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    messageType: MessageType.Personal as MessageType,
    recipientId: recipientId || ''
  });

  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch users for recipient selection
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers({ page: 1, pageSize: 100 }),
    enabled: open
  });

  useEffect(() => {
    if (recipientId && usersData?.data) {
      const recipient = usersData.data.find(u => u.id === recipientId);
      setSelectedRecipient(recipient || null);
      setFormData(prev => ({ ...prev, recipientId }));
    }
  }, [recipientId, usersData]);

  useEffect(() => {
    if (!open) {
      setFormData({
        subject: '',
        content: '',
        messageType: MessageType.Personal,
        recipientId: recipientId || ''
      });
      setSelectedRecipient(null);
      setErrors({});
    }
  }, [open, recipientId]);

  const sendMutation = useMutation({
    mutationFn: (data: CreateMessageDto) => messageService.sendMessage(data),
    onSuccess: async (message) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      
      // Send via SignalR for real-time delivery
      try {
        if (formData.messageType === MessageType.Broadcast) {
          await sendBroadcast(formData.content);
        } else if (formData.recipientId) {
          await sendSignalRMessage(formData.content, formData.recipientId);
        }
      } catch (error) {
        console.error('SignalR send failed:', error);
      }
      
      onClose();
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to send message' });
    }
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRecipientChange = (_event: any, value: User | null) => {
    setSelectedRecipient(value);
    setFormData(prev => ({ ...prev, recipientId: value?.id || '' }));
    if (errors.recipientId) {
      setErrors(prev => ({ ...prev, recipientId: '' }));
    }
  };

  const handleMessageTypeChange = (type: MessageType) => {
    handleChange('messageType', type);
    if (type === MessageType.Broadcast) {
      setSelectedRecipient(null);
      setFormData(prev => ({ ...prev, recipientId: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required';
    }

    if (formData.messageType === MessageType.Personal && !formData.recipientId) {
      newErrors.recipientId = 'Recipient is required for personal messages';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const messageDto: CreateMessageDto = {
      subject: formData.subject || undefined,
      content: formData.content,
      messageType: formData.messageType,
      recipientId: formData.messageType === MessageType.Personal ? formData.recipientId : undefined
    };

    sendMutation.mutate(messageDto);
  };

  const availableUsers = usersData?.data.filter(u => u.id !== user?.id) || [];
  const canSendBroadcast = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Message</DialogTitle>
      <DialogContent>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 1 }}>
          <TextField
            select
            label="Message Type"
            required
            value={formData.messageType}
            onChange={(e) => handleMessageTypeChange(e.target.value as MessageType)}
          >
            <MenuItem value={MessageType.Personal}>Personal Message</MenuItem>
            {canSendBroadcast && (
              <MenuItem value={MessageType.Broadcast}>Broadcast to All</MenuItem>
            )}
          </TextField>

          {formData.messageType === MessageType.Personal && (
            <Autocomplete
              options={availableUsers}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
              value={selectedRecipient}
              onChange={handleRecipientChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recipient"
                  required
                  error={!!errors.recipientId}
                  helperText={errors.recipientId}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Box sx={{ fontWeight: 'bold' }}>
                      {option.firstName} {option.lastName}
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {option.email} - {option.role}
                    </Box>
                  </Box>
                </li>
              )}
            />
          )}

          {formData.messageType === MessageType.Broadcast && (
            <Alert severity="info">
              This message will be sent to all users in the system.
            </Alert>
          )}

          <TextField
            label="Subject (Optional)"
            fullWidth
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Enter message subject"
          />

          <TextField
            label="Message"
            fullWidth
            required
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            placeholder="Type your message here..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={sendMutation.isPending}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Campaign as BroadcastIcon,
  Settings as SystemIcon,
} from '@mui/icons-material';
import { Message, MessageType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../services/messageService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NotificationPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  messages: Message[];
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  messages,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => messageService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case MessageType.Broadcast:
        return <BroadcastIcon fontSize="small" color="primary" />;
      case MessageType.System:
        return <SystemIcon fontSize="small" color="warning" />;
      default:
        return <MessageIcon fontSize="small" color="action" />;
    }
  };

  const handleMessageClick = (message: Message) => {
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id.toString());
    }
    onClose();
    navigate('/messaging');
  };

  const handleViewAll = () => {
    onClose();
    navigate('/messaging');
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: 360, maxHeight: 480 }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            You have {messages.length} unread {messages.length === 1 ? 'message' : 'messages'}
          </Typography>
        </Box>
        <Divider />
        
        {messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No new notifications</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 360, overflow: 'auto' }}>
            {messages.slice(0, 5).map((message, index) => (
              <React.Fragment key={message.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMessageClick(message)}
                    sx={{
                      bgcolor: 'action.hover',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {getMessageIcon(message.messageType)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {message.subject}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {message.content.substring(0, 60)}
                          {message.content.length > 60 ? '...' : ''}
                        </Typography>
                      }
                    />
                    {!message.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
        
        {messages.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button fullWidth onClick={handleViewAll}>
                View All Messages
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};

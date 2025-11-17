import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Badge,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Button,
  Tabs,
  Tab,
  Tooltip,
  InputAdornment,
  Divider,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  Announcement as BroadcastIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { Message, MessageType } from '../../types';
import { MessageDialog } from './MessageDialog';
import { ConversationView } from './ConversationView';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/dateUtils';

type MessageView = 'inbox' | 'sent' | 'broadcast';

export const MessageList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [view, setView] = useState<MessageView>('inbox');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MessageType | ''>('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch messages
  const { data: messagesData, isLoading, refetch } = useQuery({
    queryKey: ['messages', page, pageSize],
    queryFn: () => messageService.getMessages({ page, pageSize }),
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => messageService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => messageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => messageService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const handleViewChange = (_event: React.SyntheticEvent, newValue: MessageView) => {
    setView(newValue);
    setPage(1);
  };

  const handleNewMessage = () => {
    setDialogOpen(true);
  };

  const handleMessageClick = (message: Message) => {
    if (!message.isRead && message.recipientId === user?.id) {
      markAsReadMutation.mutate(message.id);
    }
    
    // Open conversation if it's a personal message
    if (message.messageType === MessageType.Personal) {
      const otherUserId = message.senderId === user?.id ? message.recipientId : message.senderId;
      if (otherUserId) {
        setSelectedUserId(otherUserId);
        setConversationOpen(true);
      }
    }
  };

  const handleDelete = async (message: Message, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(message.id);
    }
  };

  const handleMarkAsRead = (message: Message, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConversationClose = () => {
    setConversationOpen(false);
    setSelectedUserId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Filter messages based on view and search
  const filteredMessages = React.useMemo(() => {
    if (!messagesData?.data) return [];

    let messages = messagesData.data;

    // Filter by view
    if (view === 'inbox') {
      messages = messages.filter(m => m.recipientId === user?.id || m.messageType === MessageType.Broadcast);
    } else if (view === 'sent') {
      messages = messages.filter(m => m.senderId === user?.id);
    } else if (view === 'broadcast') {
      messages = messages.filter(m => m.messageType === MessageType.Broadcast);
    }

    // Filter by message type
    if (typeFilter) {
      messages = messages.filter(m => m.messageType === typeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      messages = messages.filter(m => 
        m.content.toLowerCase().includes(searchLower) ||
        m.subject?.toLowerCase().includes(searchLower) ||
        m.sender?.firstName.toLowerCase().includes(searchLower) ||
        m.sender?.lastName.toLowerCase().includes(searchLower)
      );
    }

    return messages;
  }, [messagesData, view, typeFilter, searchTerm, user]);

  const unreadCount = filteredMessages.filter(m => !m.isRead && m.recipientId === user?.id).length;

  const getMessageIcon = (messageType: MessageType) => {
    switch (messageType) {
      case MessageType.Broadcast:
        return <BroadcastIcon fontSize="small" />;
      case MessageType.System:
        return <SendIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const canDelete = (message: Message) => {
    return user?.role === 'Admin' || message.senderId === user?.id;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Messages</Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error">
              <Box />
            </Badge>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewMessage}
          >
            New Message
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={view}
          onChange={handleViewChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label="Inbox" 
            value="inbox"
            icon={unreadCount > 0 ? <Badge badgeContent={unreadCount} color="error" /> : undefined}
            iconPosition="end"
          />
          <Tab label="Sent" value="sent" />
          <Tab label="Broadcasts" value="broadcast" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages, sender..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          
          <TextField
            select
            label="Message Type"
            size="small"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MessageType | '')}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value={MessageType.Personal}>Personal</MenuItem>
            <MenuItem value={MessageType.Broadcast}>Broadcast</MenuItem>
            <MenuItem value={MessageType.System}>System</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <Paper>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading messages...</Typography>
          </Box>
        ) : filteredMessages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No messages found</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredMessages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!message.isRead && message.recipientId === user?.id && (
                        <Tooltip title="Mark as read">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleMarkAsRead(message, e)}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDelete(message) && (
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleDelete(message, e)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                >
                  <ListItemButton onClick={() => handleMessageClick(message)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ bgcolor: message.isRead ? 'grey.400' : 'primary.main' }}>
                        {message.sender?.firstName?.[0] || 'S'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: message.isRead ? 'normal' : 'bold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {view === 'sent' 
                              ? `To: ${message.recipient?.firstName} ${message.recipient?.lastName}` 
                              : `${message.sender?.firstName} ${message.sender?.lastName}`}
                          </Typography>
                          {getMessageIcon(message.messageType) && (
                            <Chip 
                              icon={getMessageIcon(message.messageType)!}
                              label={message.messageType}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {!message.isRead && message.recipientId === user?.id && (
                            <Chip label="Unread" size="small" color="error" />
                          )}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: message.isRead ? 'normal' : 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {message.subject || 'No Subject'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {message.content}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(message.createdDate)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {index < filteredMessages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <MessageDialog
        open={dialogOpen}
        onClose={handleDialogClose}
      />

      <ConversationView
        open={conversationOpen}
        onClose={handleConversationClose}
        userId={selectedUserId}
      />
    </Box>
  );
};

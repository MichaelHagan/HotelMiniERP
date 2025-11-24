import React, { useState, useMemo, useEffect } from 'react';
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
import { messageService, userService } from '../../services';
import { Message, MessageType, UserRole, User } from '../../types';
import { MessageDialog } from './MessageDialog';
import { ConversationView } from './ConversationView';
import { useAuth } from '../../context/AuthContext';
import { useSignalR } from '../../context/SignalRContext';
import { formatDateTime } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmDialogContext';

type MessageView = 'inbox' | 'sent' | 'broadcast';

export const MessageList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { connection, isConnected } = useSignalR();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  
  const [view, setView] = useState<MessageView>('inbox');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MessageType | ''>('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users for name display
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers()
  });

  // Fetch messages
  const { data: messagesData, isLoading, refetch } = useQuery({
    queryKey: ['messages', page, pageSize],
    queryFn: () => messageService.getMessages({ page, pageSize }),
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Listen for real-time message updates via SignalR
  useEffect(() => {
    if (connection && isConnected) {
      const handleNewNotification = (message: Message) => {
        console.log('MessageList received new message:', message);
        // Immediately refetch messages for instant update
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      };

      connection.on('NewNotification', handleNewNotification);

      return () => {
        connection.off('NewNotification', handleNewNotification);
      };
    }
  }, [connection, isConnected, queryClient]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => messageService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      showSuccess('Message marked as read');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error?.message || 'Failed to mark message as read');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => messageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      showSuccess('Message deleted successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error?.message || 'Failed to delete message');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => messageService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      showSuccess('All messages marked as read');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error?.message || 'Failed to mark all messages as read');
    },
  });

  const handleViewChange = (_event: React.SyntheticEvent, newValue: MessageView) => {
    setView(newValue);
    setPage(1);
  };

  const handleNewMessage = () => {
    setDialogOpen(true);
  };

  const handleMessageClick = (message: Message) => {
    // Mark as read if unread and it's for the current user (personal or broadcast)
    if (!message.isRead) {
      if (message.messageType === MessageType.Broadcast || message.receiverId === Number(user?.id)) {
        markAsReadMutation.mutate(message.id);
      }
    }
    
    // Open conversation if it's a personal message
    if (message.messageType === MessageType.Personal) {
      const otherUserId = message.senderId === Number(user?.id) ? message.receiverId : message.senderId;
      if (otherUserId) {
        setSelectedUserId(String(otherUserId));
        setConversationOpen(true);
      }
    }
  };

  const handleDelete = async (message: Message, event: React.MouseEvent) => {
    event.stopPropagation();
    const confirmed = await confirm(
      'Are you sure you want to delete this message?',
      'Confirm Deletion'
    );
    if (confirmed) {
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

  const handleConversationOpen = (userId: number) => {
    setSelectedUserId(String(userId));
    setConversationOpen(true);
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
      messages = messages.filter(m => m.receiverId === Number(user?.id) || m.messageType === MessageType.Broadcast);
    } else if (view === 'sent') {
      messages = messages.filter(m => m.senderId === Number(user?.id));
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
        m.subject?.toLowerCase().includes(searchLower)
      );
    }

    return messages;
  }, [messagesData, view, typeFilter, searchTerm, user]);

  const unreadCount = filteredMessages.filter(m => !m.isRead && m.receiverId === Number(user?.id)).length;

  // Group personal messages by conversation (other user)
  const groupedMessages = useMemo(() => {
    const userMap = new Map<number, User>();
    const userList = Array.isArray(users) ? users : (users?.data || []);
    userList.forEach((u: User) => userMap.set(Number(u.id), u));

    const conversations = new Map<number, Message[]>();
    const broadcasts: Message[] = [];
    const systemMessages: Message[] = [];

    filteredMessages.forEach(msg => {
      if (msg.messageType === MessageType.Broadcast) {
        broadcasts.push(msg);
      } else if (msg.messageType === MessageType.System) {
        systemMessages.push(msg);
      } else if (msg.messageType === MessageType.Personal && msg.receiverId !== null) {
        // Determine the "other" user in the conversation
        const otherUserId = msg.senderId === Number(user?.id) ? msg.receiverId : msg.senderId;
        
        if (!conversations.has(otherUserId)) {
          conversations.set(otherUserId, []);
        }
        conversations.get(otherUserId)!.push(msg);
      }
    });

    // Convert conversations map to array and sort by most recent message
    const conversationList = Array.from(conversations.entries())
      .map(([userId, msgs]) => {
        const sortedMsgs = msgs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestMsg = sortedMsgs[0];
        const unreadInConv = msgs.filter(m => !m.isRead && m.receiverId === Number(user?.id)).length;
        const otherUser = userMap.get(userId);

        return {
          userId,
          userName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : `User ${userId}`,
          userInitials: otherUser ? `${otherUser.firstName[0]}${otherUser.lastName[0]}` : 'U',
          latestMessage: latestMsg,
          unreadCount: unreadInConv,
          totalMessages: msgs.length
        };
      })
      .sort((a, b) => 
        new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime()
      );

    return { conversations: conversationList, broadcasts, systemMessages };
  }, [filteredMessages, users, user]);

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
    return user?.role === UserRole.Admin || message.senderId === Number(user?.id);
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
            {/* Conversations */}
            {groupedMessages.conversations.map((conversation, index) => (
              <React.Fragment key={`conv-${conversation.userId}`}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleConversationOpen(conversation.userId)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ bgcolor: conversation.unreadCount > 0 ? 'primary.main' : 'grey.400' }}>
                        {conversation.userInitials}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {conversation.userName}
                          </Typography>
                          {conversation.unreadCount > 0 && (
                            <Badge badgeContent={conversation.unreadCount} color="error" />
                          )}
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {conversation.latestMessage.content}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(conversation.latestMessage.createdAt)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {(index < groupedMessages.conversations.length - 1 || groupedMessages.broadcasts.length > 0 || groupedMessages.systemMessages.length > 0) && <Divider />}
              </React.Fragment>
            ))}

            {/* Broadcasts */}
            {groupedMessages.broadcasts.map((message, index) => (
              <React.Fragment key={`bc-${message.id}`}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    canDelete(message) && (
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleDelete(message, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemButton onClick={() => handleMessageClick(message)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ bgcolor: message.isRead ? 'grey.400' : 'warning.main' }}>
                        <BroadcastIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: message.isRead ? 'normal' : 'bold' }}>
                            Broadcast
                          </Typography>
                          {!message.isRead && (
                            <Chip label="Unread" size="small" color="error" />
                          )}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ fontWeight: message.isRead ? 'normal' : 'bold' }}
                        >
                          {message.subject || 'No Subject'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {message.content}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {(index < groupedMessages.broadcasts.length - 1 || groupedMessages.systemMessages.length > 0) && <Divider />}
              </React.Fragment>
            ))}

            {/* System Messages */}
            {groupedMessages.systemMessages.map((message, index) => (
              <React.Fragment key={`sys-${message.id}`}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMessageClick(message)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <SendIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2">System Message</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {message.subject || 'No Subject'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {message.content}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {index < groupedMessages.systemMessages.length - 1 && <Divider />}
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

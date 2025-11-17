import React from 'react';
import { Box } from '@mui/material';
import { MessageList } from '../components/Messaging/MessageList';

export const MessagingPage: React.FC = () => {
  return (
    <Box>
      <MessageList />
    </Box>
  );
};